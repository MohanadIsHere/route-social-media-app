import { APP_EMAIL, APP_EMAIL_PASSWORD } from "../../config/env";
import nodemailer from "nodemailer";
import { emailEvents } from "./eventEmitter";
emailEvents.on("sendEmail", (data:any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: APP_EMAIL,
      pass: APP_EMAIL_PASSWORD,
    },
  });

  (async () => {
    await transporter.sendMail({
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
