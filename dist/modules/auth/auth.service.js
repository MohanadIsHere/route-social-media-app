"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../database/models/user.model");
const user_repository_1 = require("../../database/repository/user.repository");
const utils_1 = require("../../utils");
const env_1 = require("../../config/env");
class AuthService {
    userModel = new user_repository_1.UserRepository(user_model_1.User);
    constructor() { }
    register = async (req, res) => {
        const { password, phone } = req.body || {};
        const otp = (0, utils_1.otpGen)();
        const hashed = await (0, utils_1.hashText)({
            plainText: password,
        });
        let encryptedPhone = undefined;
        if (phone) {
            encryptedPhone = (0, utils_1.encryptText)({ cipherText: phone });
        }
        const user = await this.userModel.createUser({
            data: {
                ...req.body,
                otp,
                phone: encryptedPhone,
                password: hashed,
            },
        });
        utils_1.eventEmitter.emit("sendEmail", {
            from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
            to: user.email,
            subject: "Email Verification",
            text: "Please verify your email address.",
            html: utils_1.emailTemplates.verifyEmail({
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
                throw new utils_1.BadRequestException("User already confirmed");
            if (user.otp !== otp)
                throw new utils_1.BadRequestException("Invalid OTP");
            await this.userModel.update({
                filter: { email },
                update: {
                    $set: { confirmed: true },
                    $unset: { otp: "" },
                },
            });
            utils_1.eventEmitter.emit("sendEmail", {
                from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
                to: user.email,
                subject: "Email Verified",
                text: "Your email address has been successfully verified.",
                html: utils_1.emailTemplates.welcomeEmail({
                    firstName: user.firstName,
                }),
            });
            return res.status(200).json({
                message: "Email verified successfully.",
            });
        }
        throw new utils_1.NotFoundException("User not found");
    };
    login = async (req, res) => {
        const { email, password } = req.body || {};
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new utils_1.NotFoundException("Invalid credentials");
        if (!user.confirmed)
            throw new utils_1.BadRequestException("Please verify your email before logging in");
        const isPasswordValid = await (0, utils_1.compareHash)({
            plainText: password,
            cipherText: user.password,
        });
        if (!isPasswordValid)
            throw new utils_1.BadRequestException("Invalid credentials");
        const credentials = (0, utils_1.createLoginCredentials)(user);
        return res.status(200).json({
            message: "Login successful",
            data: {
                credentials,
            },
        });
    };
}
exports.default = new AuthService();
