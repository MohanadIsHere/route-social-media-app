"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../database/models/user.model");
const user_repository_1 = require("../../database/repository/user.repository");
const env_1 = require("../../config/env");
const events_1 = require("../../utils/events");
const hash_1 = require("../../utils/security/hash");
const encryption_1 = require("../../utils/security/encryption");
const templates_1 = require("../../utils/templates");
const response_1 = require("../../utils/response");
const tokens_1 = require("../../utils/tokens");
const token_repository_1 = require("../../database/repository/token.repository");
const token_model_1 = require("../../database/models/token.model");
class AuthService {
    userModel = new user_repository_1.UserRepository(user_model_1.User);
    tokenModel = new token_repository_1.TokenRepository(token_model_1.Token);
    constructor() { }
    register = async (req, res) => {
        const { password, phone } = req.body || {};
        const otp = (0, events_1.otpGen)();
        const hashed = await (0, hash_1.hashText)({
            plainText: password,
        });
        let encryptedPhone = undefined;
        if (phone) {
            encryptedPhone = (0, encryption_1.encryptText)({ cipherText: phone });
        }
        const user = await this.userModel.createUser({
            data: {
                ...req.body,
                otp,
                phone: encryptedPhone,
                password: hashed,
            },
        });
        events_1.eventEmitter.emit("sendEmail", {
            from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
            to: user.email,
            subject: "Email Verification",
            text: "Please verify your email address.",
            html: templates_1.emailTemplates.verifyEmail({
                otp,
                firstName: user.firstName,
            }),
        });
        return res.status(201).json({
            message: "User registered successfully, please check your email for verification.",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    address: user.address ? user.address : undefined,
                    gender: user.gender,
                    phone: user.phone ? user.phone : undefined,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
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
            if (user.otp !== otp)
                throw new response_1.BadRequestException("Invalid OTP");
            await this.userModel.updateOne({
                filter: { email },
                update: {
                    $set: { confirmed: true },
                    $unset: { otp: "" },
                },
            });
            events_1.eventEmitter.emit("sendEmail", {
                from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
                to: user.email,
                subject: "Email Verified",
                text: "Your email address has been successfully verified.",
                html: templates_1.emailTemplates.welcomeEmail({
                    firstName: user.firstName,
                }),
            });
            return res.status(200).json({
                message: "Email verified successfully.",
            });
        }
        throw new response_1.NotFoundException("User not found");
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
        return res.status(200).json({
            message: "User logged in successfully",
            data: {
                credentials,
            },
        });
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
                await this.tokenModel.create({
                    data: {
                        jti: req?.decoded?.jti,
                        expiresIn: req?.decoded?.iat + Number(env_1.REFRESH_TOKEN_EXPIRES_IN),
                        userId: req?.decoded?.id,
                    },
                });
                statusCode = 201;
                break;
        }
        await this.userModel.updateOne({
            filter: { _id: req?.decoded?.id },
            update,
        });
        return res.status(statusCode).json({
            message: flag === tokens_1.LogoutEnum.only
                ? "Logged out successfully from this device"
                : "Logged out successfully from all devices",
        });
    };
}
exports.default = new AuthService();
