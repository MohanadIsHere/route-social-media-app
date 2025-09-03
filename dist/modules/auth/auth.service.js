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
        const otp = utils_1.otpGen;
        const user = await this.userModel.createUser({
            data: { ...req.body, otp },
        });
        utils_1.eventEmitter.emit("sendEmail", {
            from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
            to: user.email,
            subject: "Email Verification",
            text: "Please verify your email address.",
            html: utils_1.emailTemplates.confirmEmail({
                otp,
                firstName: user.firstName,
                link: `${req.protocol}://${req.get("host")}/api/auth/verify-email`,
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
        console.log({ user });
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
    login = (req, res) => { };
}
exports.default = new AuthService();
