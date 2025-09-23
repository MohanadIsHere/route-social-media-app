import { EventEmitter } from "node:events";
import { APP_EMAIL, APP_EMAIL_PASSWORD } from "../../config/env";
import nodemailer from "nodemailer";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: APP_EMAIL,
      pass: APP_EMAIL_PASSWORD,
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
export const otpGen = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};