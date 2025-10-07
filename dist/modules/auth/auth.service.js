"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../database/models");
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../../config/env");
const hash_1 = require("../../utils/security/hash");
const templates_1 = require("../../utils/templates");
const response_1 = require("../../utils/response");
const tokens_1 = require("../../utils/tokens");
const events_1 = require("../../utils/events");
const repository_1 = require("../../database/repository");
class AuthService {
    userModel = new repository_1.UserRepository(models_1.User);
    constructor() { }
    async verifyGmailAccount({ idToken, }) {
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: env_1.WEB_CLIENT_ID,
        });
        if (!ticket)
            throw new response_1.BadRequestException("Invalid Token");
        const payload = ticket.getPayload();
        if (!payload?.email_verified)
            throw new response_1.BadRequestException("Failed to verify this account");
        return payload;
    }
    registerWithGmail = async (req, res) => {
        const { idToken } = req.body || {};
        const { email, given_name, family_name, picture } = await this.verifyGmailAccount({ idToken });
        let user = await this.userModel.findOne({ email: email });
        if (user) {
            if (user.provider === models_1.UserProviders.google) {
                return await this.loginWithGmail(req, res);
            }
            throw new response_1.ConflictException(`Email already exist with ${user.provider} provider`);
        }
        user = await this.userModel.createUser({
            data: {
                firstName: given_name,
                lastName: family_name,
                email: email,
                profileImage: picture,
                confirmedAt: new Date(),
                confirmed: true,
                provider: models_1.UserProviders.google,
            },
        });
        if (!user)
            throw new response_1.BadRequestException("Failed to register with gmail, please try again later");
        const credentials = (0, tokens_1.createLoginCredentials)(user);
        return (0, response_1.successResponse)({
            res,
            message: "User registered successfully",
            data: { credentials },
            statusCode: 201,
        });
    };
    register = async (req, res) => {
        await this.userModel.createUser({
            data: {
                ...req.body,
                otpExpiresIn: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        return (0, response_1.successResponse)({
            res,
            message: "User registered successfully, please check your email for verification.",
            statusCode: 201,
        });
    };
    verifyEmail = async (req, res) => {
        const { otp, email } = req.body || {};
        const [user] = await this.userModel.findFilter({
            filter: { email },
        });
        if (user) {
            if (user.confirmed)
                throw new response_1.BadRequestException("User already confirmed");
            if (user.confirmEmailOtp &&
                !(await (0, hash_1.compareHash)({
                    plainText: otp,
                    cipherText: user.confirmEmailOtp,
                })))
                throw new response_1.BadRequestException("Invalid OTP");
            if (user.otpExpiresIn && user.otpExpiresIn < new Date())
                throw new response_1.BadRequestException("OTP expired");
            await this.userModel.updateOne({
                filter: { email },
                update: {
                    $set: { confirmed: true, confirmedAt: new Date() },
                    $unset: { confirmEmailOtp: "", otpExpiresIn: "" },
                },
            });
            events_1.emailEvents.emit("sendEmail", {
                from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
                to: user.email,
                subject: "Email Verified",
                text: "Your email address has been successfully verified.",
                html: templates_1.emailTemplates.welcomeEmail({
                    firstName: user.firstName,
                }),
            });
            return (0, response_1.successResponse)({
                res,
                message: "Email verified successfully.",
            });
        }
        throw new response_1.NotFoundException("User not found");
    };
    loginWithGmail = async (req, res) => {
        const { idToken } = req.body || {};
        const { email } = await this.verifyGmailAccount({
            idToken,
        });
        const user = await this.userModel.findOne({
            email: email,
            provider: models_1.UserProviders.google,
        });
        if (!user)
            throw new response_1.NotFoundException("Email does not exist with google provider");
        const credentials = (0, tokens_1.createLoginCredentials)(user);
        return (0, response_1.successResponse)({
            res,
            message: "User logged in successfully",
            data: { credentials },
        });
    };
    login = async (req, res) => {
        const { email, password } = req.body || {};
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new response_1.NotFoundException("Invalid credentials");
        if (!user.confirmed)
            throw new response_1.BadRequestException("Please verify your email before logging in");
        const isPasswordValid = await (0, hash_1.compareHash)({
            plainText: password,
            cipherText: user.password,
        });
        if (!isPasswordValid)
            throw new response_1.BadRequestException("Invalid credentials");
        const credentials = (0, tokens_1.createLoginCredentials)(user);
        return (0, response_1.successResponse)({
            res,
            message: "User logged in successfully",
            data: {
                credentials,
            },
        });
    };
    sendForgetPasswordCode = async (req, res) => {
        const { email } = req.body || {};
        const user = await this.userModel.findOne({
            email,
            provider: models_1.UserProviders.system,
            confirmed: { $exists: true },
        });
        if (!user)
            throw new response_1.NotFoundException("User not found due to one of the following reasons: [not registered, Invalid provider, not confirmed]");
        const otp = (0, events_1.otpGen)();
        const result = await this.userModel.updateOne({
            filter: { email },
            update: {
                $set: { resetPasswordOtp: await (0, hash_1.hashText)({ plainText: String(otp) }) },
            },
        });
        if (!result?.matchedCount)
            throw new response_1.BadRequestException("Failed to send reset password otp, please try again later");
        events_1.emailEvents.emit("sendEmail", {
            from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
            to: user.email,
            subject: "Reset Password",
            text: "otp for reset password",
            html: templates_1.emailTemplates.sendEmailForResetPasswordOtp({
                otp,
                firstName: user.firstName,
            }),
        });
        return (0, response_1.successResponse)({
            res,
            message: "Otp Sent, please check your inbox for the otp, check your spams if you didn't get the email",
        });
    };
    resetPassword = async (req, res) => {
        const { email, otp, password, confirmPassword } = req.body || {};
        if (password !== confirmPassword)
            throw new response_1.BadRequestException("confirmPassword does not match password");
        const user = await this.userModel.findOne({
            email,
            confirmed: { $exists: true },
            resetPasswordOtp: { $exists: true },
            provider: models_1.UserProviders.system,
        });
        if (!user)
            throw new response_1.NotFoundException("User not found due to one of the following reasons: [not registered, Invalid provider, not confirmed,otp does not exist]");
        if (!(await (0, hash_1.compareHash)({
            plainText: String(otp),
            cipherText: user.resetPasswordOtp,
        })))
            throw new response_1.BadRequestException("Invalid Otp");
        const result = await this.userModel.updateOne({
            filter: { email: user.email },
            update: {
                $unset: { otp: "", resetPasswordOtp: "" },
                $set: {
                    changeCredentialsAt: new Date(),
                    password: await (0, hash_1.hashText)({ plainText: password }),
                },
            },
        });
        if (!result.matchedCount)
            throw new response_1.BadRequestException("Failed to reset password, please try again later");
        events_1.emailEvents.emit("sendEmail", {
            from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
            to: user.email,
            subject: "Password Reset",
            text: "Password Reset Successfully",
            html: templates_1.emailTemplates.passwordResetSuccessfullyEmail({
                firstName: user.firstName,
            }),
        });
        return (0, response_1.successResponse)({ res, message: "Password Reset Successfully" });
    };
    logout = async (req, res) => {
        const { flag } = req.body || {};
        let statusCode = 200;
        const update = {};
        switch (flag) {
            case tokens_1.LogoutEnum.all:
                update.changeCredentialsAt = new Date();
                break;
            default:
                await (0, tokens_1.createRevokeToken)({ decoded: req?.decoded });
                statusCode = 201;
                break;
        }
        await this.userModel.updateOne({
            filter: { _id: req?.decoded?.id },
            update,
        });
        return statusCode === 201
            ? (0, response_1.successResponse)({
                res,
                statusCode,
                message: flag === tokens_1.LogoutEnum.only
                    ? "Logged out successfully from this device"
                    : "Logged out successfully from all devices",
            })
            : (0, response_1.successResponse)({
                res,
                statusCode,
                message: flag === tokens_1.LogoutEnum.only
                    ? "Logged out successfully from this device"
                    : "Logged out successfully from all devices",
            });
    };
}
exports.default = new AuthService();
