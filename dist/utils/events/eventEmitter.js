"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGen = exports.eventEmitter = void 0;
const node_events_1 = require("node:events");
const env_1 = require("../../config/env");
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.eventEmitter = new node_events_1.EventEmitter();
exports.eventEmitter.on("sendEmail", (data) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: env_1.APP_EMAIL,
            pass: env_1.APP_EMAIL_PASSWORD,
        },
    });
    (async () => {
        const info = await transporter.sendMail({
            from: data?.from,
            to: data?.to,
            subject: data?.subject,
            text: data?.text,
            html: data?.html,
        });
    })();
});
const otpGen = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.otpGen = otpGen;
