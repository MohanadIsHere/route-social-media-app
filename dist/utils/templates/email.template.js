"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
const env_1 = require("../../config/env");
exports.emailTemplates = {
    verifyEmail: ({ otp, firstName, }) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - OTP Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f9f9f9;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      font-size: 22px;
    }
    .otp {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      letter-spacing: 8px;
      text-align: center;
      margin: 20px 0;
    }
    p {
      color: #555;
      font-size: 15px;
      line-height: 1.5;
    }
    .note {
      font-size: 13px;
      color: #888;
      margin-top: 10px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello ${firstName},</h1>
    <p>Here is your verification code for <strong>${env_1.APP_NAME}</strong>:</p>
    <div class="otp">${otp}</div>
    <p class="note">This code will expire in 10 minutes. Do not share it with anyone.</p>
  </div>
</body>
</html>`;
    },
    welcomeEmail: ({ firstName, website_url = "http://localhost:3000", }) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${env_1.APP_NAME}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f9f9f9;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 {
      color: #333;
      font-size: 24px;
    }
    p {
      color: #555;
      font-size: 15px;
      line-height: 1.6;
      margin: 15px 0;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 25px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      text-decoration: none;
      border-radius: 30px;
      font-weight: bold;
      transition: 0.3s;
    }
    .button:hover {
      background: linear-gradient(135deg, #5a6fdc, #6a3d9e);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome, ${firstName}! 🎉</h1>
    <p>We’re excited to have you on board with <strong>${env_1.APP_NAME}</strong>.</p>
    <p>Start exploring your account and make the most out of our platform.</p>
    <a href="${website_url}" class="button">Get Started</a>
  </div>
</body>
</html>`;
    },
};
