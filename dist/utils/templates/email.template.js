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
    sendEmailForResetPasswordOtp: ({ otp, firstName, }) => {
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
    <p>Here is your reset password otp for <strong>${env_1.APP_NAME}</strong>:</p>
    <div class="otp">${otp}</div>
    <p class="note">IF You didn't request for reset password otp, please ignore this message</p>
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
    passwordResetSuccessfullyEmail: ({ firstName, }) => {
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
      .note {
      font-size: 13px;
      color: #888;
      margin-top: 10px;
      text-align: center;
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
    <h1>Welcome, ${firstName}!</h1>
    <p>We're glad to tell you that your password for <strong>${env_1.APP_NAME}</strong> has been updated successfully 🎉.</p>
    <p class="note">IF You didn't request for reset password otp, please contact us.</p>
  </div>
</body>
</html>`;
    },
    taggedInPost: ({ taggedBy, postContent, firstName, postType, }) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You've Been Mentioned!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .email-container {
            background: white;
            max-width: 600px;
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: sparkle 3s infinite ease-in-out;
        }

        @keyframes sparkle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
        }

        .notification-icon {
            width: 90px;
            height: 90px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
            animation: bellRing 2s ease-in-out infinite;
        }

        @keyframes bellRing {
            0%, 100% { transform: rotate(0deg); }
            10%, 30% { transform: rotate(-15deg); }
            20%, 40% { transform: rotate(15deg); }
            50% { transform: rotate(0deg); }
        }

        .notification-icon svg {
            width: 45px;
            height: 45px;
            fill: white;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 35px;
        }

        .greeting {
            font-size: 22px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .mention-message {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .mention-message strong {
            color: #667eea;
            font-weight: 700;
        }

        .user-info {
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #f8f9ff 0%, #f1f3ff 100%);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 25px;
            border: 2px solid #e3e8ff;
        }

        .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: 700;
            margin-right: 15px;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .user-details {
            flex: 1;
        }

        .user-name {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
        }

        .user-action {
            font-size: 14px;
            color: #666;
        }

        .post-container {
            background: #ffffff;
            border: 2px solid #e9ecef;
            border-left: 4px solid #667eea;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }

        .post-header {
            font-size: 14px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .post-content {
            font-size: 15px;
            color: #333;
            line-height: 1.7;
            margin-bottom: 15px;
        }

        .post-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid #e9ecef;
        }

        .post-time {
            font-size: 13px;
            color: #999;
        }

        .post-type {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            color: #1976d2;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
        }

        .action-button {
            display: inline-block;
            width: 100%;
            text-align: center;
            padding: 16px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 25px;
        }

        .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .quick-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
        }

        .quick-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
            background: #e9ecef;
            border-color: #667eea;
            transform: translateY(-2px);
        }

        .quick-action-btn span {
            margin-right: 8px;
            font-size: 18px;
        }

        .info-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 25px;
        }

        .info-box p {
            font-size: 14px;
            color: #856404;
            line-height: 1.5;
            margin: 0;
        }

        .info-box strong {
            color: #856404;
        }

        .footer {
            background: #f8f9fa;
            padding: 30px 35px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            width: 40px;
            height: 40px;
            background: #667eea;
            border-radius: 50%;
            color: white;
            text-decoration: none;
            line-height: 40px;
            font-size: 18px;
            transition: transform 0.3s ease;
        }

        .social-links a:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 25px 0;
        }

        @media (max-width: 600px) {
            body {
                padding: 10px;
            }

            .content {
                padding: 30px 20px;
            }

            .header {
                padding: 30px 20px;
            }

            .greeting {
                font-size: 20px;
            }

            .quick-actions {
                grid-template-columns: 1fr;
            }

            .footer {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="notification-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,22A2,2 0 0,1 10,20H14A2,2 0 0,1 12,22M18,16V11C18,7.93 16.37,5.36 13.5,4.68V4A1.5,1.5 0 0,0 12,2.5A1.5,1.5 0 0,0 10.5,4V4.68C7.63,5.36 6,7.92 6,11V16L4,18V19H20V18L18,16M12,6A5,5 0 0,1 17,11V17H7V11A5,5 0 0,1 12,6Z"/>
                </svg>
            </div>
            <h1>You've Been Mentioned! 🎯</h1>
            <p>Someone tagged you in a post</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hi ${firstName}!</div>
            
            <div class="mention-message">
                Great news! <strong>${taggedBy} </strong> mentioned you in a post. They thought you'd be interested in what they had to share.
            </div>

            <!-- User Who Tagged -->
            <div class="user-info">
                <div class="user-avatar">SW</div>
                <div class="user-details">
                    <div class="user-name">${taggedBy}</div>
                    <div class="user-action">Tagged you in a post</div>
                </div>
            </div>

            <!-- Post Preview -->
            <div class="post-container">
                <div class="post-header">📝 Post Content</div>
                <div class="post-content">
                    "${postContent}"
                </div>
                <div class="post-meta">
                    <span class="post-type">${postType}</span>
                </div>
            </div>

            <!-- Info Box -->
            <div class="info-box">
                <p>
                    <strong>💡 Tip:</strong> You can manage your notification preferences to control when and how you receive tag notifications.
                </p>
            </div>

            <div class="divider"></div>

            <!-- Additional Context -->
            <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
                This notification was sent because <strong>${taggedBy}</strong> tagged you in their post. 
                Stay connected and see what your friends are sharing!
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                You're receiving this email because you have notifications enabled for mentions and tags.
            </p>
            <p>
                <a href="#notification-settings">Notification Settings</a> | 
                <a href="#privacy">Privacy Policy</a> | 
                <a href="#help">Help Center</a>
            </p>
            
            <div class="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Twitter">t</a>
                <a href="#" title="LinkedIn">in</a>
                <a href="#" title="Instagram">ig</a>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                © 2025 Route Social Media App. All rights reserved.<br>
            </p>
        </div>
    </div>
</body>
</html>`;
    },
    taggedInComment: ({ firstName, taggedBy, }) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tagged in Comment</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .email-container {
            background: white;
            max-width: 600px;
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: sparkle 3s infinite ease-in-out;
        }

        @keyframes sparkle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
        }

        .comment-icon {
            width: 90px;
            height: 90px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
            animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .comment-icon svg {
            width: 45px;
            height: 45px;
            fill: white;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 35px;
        }

        .greeting {
            font-size: 22px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .mention-message {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .mention-message strong {
            color: #667eea;
            font-weight: 700;
        }

        .tagger-info {
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 25px;
            border: 2px solid #ffe082;
        }

        .tagger-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: 700;
            margin-right: 15px;
            box-shadow: 0 5px 15px rgba(255, 167, 38, 0.4);
        }

        .tagger-details {
            flex: 1;
        }

        .tagger-name {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
        }

        .tagger-action {
            font-size: 14px;
            color: #666;
        }

        .comment-container {
            background: #ffffff;
            border: 2px solid #e9ecef;
            border-left: 4px solid #ffa726;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }

        .comment-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .comment-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: 700;
            margin-right: 12px;
        }

        .comment-info {
            flex: 1;
        }

        .comment-author {
            font-size: 15px;
            font-weight: 700;
            color: #333;
            margin-bottom: 3px;
        }

        .comment-time {
            font-size: 12px;
            color: #999;
        }

        .comment-badge {
            background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%);
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .comment-text {
            font-size: 15px;
            color: #333;
            line-height: 1.7;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .comment-text .mention {
            color: #667eea;
            font-weight: 700;
            background: rgba(102, 126, 234, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
        }

        .original-post {
            background: linear-gradient(135deg, #f1f3ff 0%, #e8eaf6 100%);
            padding: 15px;
            border-radius: 10px;
            border-left: 3px solid #667eea;
        }

        .post-label {
            font-size: 12px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .post-preview {
            font-size: 14px;
            color: #555;
            line-height: 1.6;
        }

        .action-button {
            display: inline-block;
            width: 100%;
            text-align: center;
            padding: 16px 30px;
            background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 25px rgba(255, 167, 38, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 25px;
        }

        .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 167, 38, 0.4);
        }

        .quick-actions {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 30px;
        }

        .quick-action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 15px 10px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
            background: #e9ecef;
            border-color: #ffa726;
            transform: translateY(-2px);
        }

        .quick-action-btn span {
            font-size: 24px;
            margin-bottom: 8px;
        }

        .context-box {
            background: #e3f2fd;
            border: 2px solid #90caf9;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 25px;
        }

        .context-box p {
            font-size: 14px;
            color: #1565c0;
            line-height: 1.5;
            margin: 0;
        }

        .context-box strong {
            color: #0d47a1;
        }

        .footer {
            background: #f8f9fa;
            padding: 30px 35px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            width: 40px;
            height: 40px;
            background: #667eea;
            border-radius: 50%;
            color: white;
            text-decoration: none;
            line-height: 40px;
            font-size: 18px;
            transition: transform 0.3s ease;
        }

        .social-links a:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 25px 0;
        }

        @media (max-width: 600px) {
            body {
                padding: 10px;
            }

            .content {
                padding: 30px 20px;
            }

            .header {
                padding: 30px 20px;
            }

            .greeting {
                font-size: 20px;
            }

            .quick-actions {
                grid-template-columns: 1fr;
            }

            .footer {
                padding: 25px 20px;
            }

            .tagger-info {
                flex-direction: column;
                text-align: center;
            }

            .tagger-avatar {
                margin-right: 0;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="comment-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9M10,16V19.08L13.08,16H20V4H4V16H10Z"/>
                </svg>
            </div>
            <h1>💬 Tagged in Comment!</h1>
            <p>Someone mentioned you in their comment</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hi ${firstName}!</div>
            
            <div class="mention-message">
                <strong>${taggedBy}</strong> mentioned you in a comment and thought you'd want to see this. Check out what they had to say!
            </div>

            <!-- Tagger Info -->
            <div class="tagger-info">
                <div class="tagger-avatar">SW</div>
                <div class="tagger-details">
                    <div class="tagger-name">${taggedBy}</div>
                    <div class="tagger-action">Tagged you in a comment</div>
                </div>
            </div>

            <!-- Comment Container -->
            <div class="comment-container">
                <div class="comment-header">
                    <div class="comment-avatar">SW</div>
                    <div class="comment-info">
                        <div class="comment-author">${taggedBy}</div>
                        <div class="comment-time">5 minutes ago</div>
                    </div>
                    <div class="comment-badge">Comment</div>
                </div>

                
            </div>

            <!-- Main Action Button -->
            <a href="#view-comment" class="action-button">
                View Comment & Reply
            </a>

            

            <!-- Context Box -->
            <div class="context-box">
                <p>
                    <strong>💡 Why did I receive this?</strong><br>
                    ${taggedBy} specifically mentioned you in their comment, which means they wanted to bring this to your attention or get your input on the discussion.
                </p>
            </div>

            <div class="divider"></div>

            <!-- Additional Context -->
            <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
                Don't miss out on the conversation! Join in and share your thoughts with ${taggedBy} and others.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                You're receiving this email because someone mentioned you in a comment.
            </p>
            <p>
                <a href="#notification-settings">Notification Settings</a> | 
                <a href="#privacy">Privacy Policy</a> | 
                <a href="#help">Help Center</a>
            </p>
            
            <div class="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Twitter">t</a>
                <a href="#" title="LinkedIn">in</a>
                <a href="#" title="Instagram">ig</a>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                © 2025 Your Social Media App. All rights reserved.<br>
                123 Social Street, City, State 12345<br>
                <a href="#unsubscribe" style="color: #999;">Unsubscribe from comment notifications</a>
            </p>
        </div>
    </div>
</body>
</html>`;
    },
    newCommentOnPost: ({ firstName, commentedBy, }) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Comment on Your Post</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .email-container {
            background: white;
            max-width: 600px;
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
            animation: sparkle 3s infinite ease-in-out;
        }

        @keyframes sparkle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
        }

        .engagement-icon {
            width: 90px;
            height: 90px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
            animation: popIn 1s ease-out;
        }

        @keyframes popIn {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .engagement-icon svg {
            width: 45px;
            height: 45px;
            fill: white;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 35px;
        }

        .greeting {
            font-size: 22px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .notification-message {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .notification-message strong {
            color: #11998e;
            font-weight: 700;
        }

        .commenter-info {
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #d4f1f4 0%, #c5f5d7 100%);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 25px;
            border: 2px solid #7de3b3;
        }

        .commenter-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: 700;
            margin-right: 15px;
            box-shadow: 0 5px 15px rgba(17, 153, 142, 0.4);
        }

        .commenter-details {
            flex: 1;
        }

        .commenter-name {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
        }

        .commenter-action {
            font-size: 14px;
            color: #666;
        }

        .comment-container {
            background: #ffffff;
            border: 2px solid #e9ecef;
            border-left: 4px solid #38ef7d;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }

        .comment-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e9ecef;
        }

        .comment-user-info {
            display: flex;
            align-items: center;
        }

        .comment-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: 700;
            margin-right: 12px;
        }

        .comment-meta {
            flex: 1;
        }

        .comment-author {
            font-size: 15px;
            font-weight: 700;
            color: #333;
            margin-bottom: 3px;
        }

        .comment-time {
            font-size: 12px;
            color: #999;
        }

        .comment-badge {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .comment-text {
            font-size: 15px;
            color: #333;
            line-height: 1.7;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .your-post {
            background: linear-gradient(135deg, #fff9e6 0%, #fff4cc 100%);
            padding: 15px;
            border-radius: 10px;
            border-left: 3px solid #ffc107;
        }

        .post-label {
            font-size: 12px;
            font-weight: 600;
            color: #ff6f00;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
        }

        .post-label::before {
            content: '📝';
            margin-right: 6px;
        }

        .post-preview {
            font-size: 14px;
            color: #555;
            line-height: 1.6;
        }

        .engagement-stats {
            display: flex;
            justify-content: space-around;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 28px;
            font-weight: 900;
            color: #11998e;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 12px;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .action-button {
            display: inline-block;
            width: 100%;
            text-align: center;
            padding: 16px 30px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 25px rgba(17, 153, 142, 0.3);
            transition: all 0.3s ease;
            margin-bottom: 20px;
        }

        .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(17, 153, 142, 0.4);
        }

        .quick-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 30px;
        }

        .quick-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
            background: #e9ecef;
            border-color: #11998e;
            transform: translateY(-2px);
        }

        .quick-action-btn span {
            margin-right: 8px;
            font-size: 20px;
        }

        .tip-box {
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            border: 2px solid #81c784;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 25px;
        }

        .tip-box p {
            font-size: 14px;
            color: #2e7d32;
            line-height: 1.5;
            margin: 0;
        }

        .tip-box strong {
            color: #1b5e20;
        }

        .footer {
            background: #f8f9fa;
            padding: 30px 35px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .footer a {
            color: #11998e;
            text-decoration: none;
            font-weight: 600;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .social-links {
            margin: 20px 0;
        }

        .social-links a {
            display: inline-block;
            margin: 0 10px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            border-radius: 50%;
            color: white;
            text-decoration: none;
            line-height: 40px;
            font-size: 18px;
            transition: transform 0.3s ease;
        }

        .social-links a:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(17, 153, 142, 0.3);
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 25px 0;
        }

        @media (max-width: 600px) {
            body {
                padding: 10px;
            }

            .content {
                padding: 30px 20px;
            }

            .header {
                padding: 30px 20px;
            }

            .greeting {
                font-size: 20px;
            }

            .engagement-stats {
                flex-direction: column;
                gap: 15px;
            }

            .footer {
                padding: 25px 20px;
            }

            .commenter-info {
                flex-direction: column;
                text-align: center;
            }

            .commenter-avatar {
                margin-right: 0;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="engagement-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9M10,16V19.08L13.08,16H20V4H4V16H10M12.19,5.5C11.3,5.5 10.59,5.68 10.05,6.04C9.5,6.4 9.22,7 9.27,7.69H11.24C11.24,7.41 11.34,7.2 11.5,7.06C11.7,6.92 11.92,6.85 12.19,6.85C12.5,6.85 12.77,6.93 12.95,7.11C13.13,7.28 13.22,7.5 13.22,7.8C13.22,8.08 13.14,8.33 13,8.54C12.83,8.76 12.62,8.94 12.36,9.08C11.84,9.4 11.5,9.68 11.29,9.92C11.1,10.16 11,10.5 11,11H13C13,10.72 13.05,10.5 13.14,10.32C13.23,10.15 13.4,10 13.66,9.85C14.12,9.64 14.5,9.36 14.79,9C15.08,8.63 15.23,8.24 15.23,7.8C15.23,7.1 14.96,6.54 14.42,6.12C13.88,5.71 13.13,5.5 12.19,5.5M11,12V14H13V12H11Z"/>
                </svg>
            </div>
            <h1>💬 New Comment!</h1>
            <p>Someone commented on your post</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hi ${firstName}!</div>
            
            <div class="notification-message">
                Great news! <strong>${commentedBy}</strong> just commented on your post. They're engaging with your content and want to share their thoughts with you.
            </div>

            <!-- Commenter Info -->
            <div class="commenter-info">
                <div class="commenter-avatar">MJ</div>
                <div class="commenter-details">
                    <div class="commenter-name">${commentedBy}</div>
                    <div class="commenter-action">Commented on your post</div>
                </div>
            </div>

            <!-- Comment Container -->
            <div class="comment-container">
                <div class="comment-header">
                    <div class="comment-user-info">
                        <div class="comment-avatar">MJ</div>
                        <div class="comment-meta">
                            <div class="comment-author">${commentedBy}</div>
                            <div class="comment-time">Just now</div>
                        </div>
                    </div>
                    <div class="comment-badge">New</div>
                </div>

               
            </div>

            <!-- Engagement Stats -->
            <div class="engagement-stats">
                <div class="stat-item">
                    <div class="stat-number">12</div>
                    <div class="stat-label">Comments</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">45</div>
                    <div class="stat-label">Likes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">8</div>
                    <div class="stat-label">Shares</div>
                </div>
            </div>

            <!-- Main Action Button -->
            <a href="#view-comment" class="action-button">
                View Comment & Reply
            </a>

           

            <!-- Tip Box -->
            <div class="tip-box">
                <p>
                    <strong>💡 Keep the conversation going!</strong><br>
                    Responding to comments helps build a stronger community and increases engagement on your posts. Your followers love hearing back from you!
                </p>
            </div>

            <div class="divider"></div>

            <!-- Additional Context -->
            <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
                Your post is getting attention! Reply to ${commentedBy} and keep the conversation alive.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                You're receiving this email because someone commented on your post.
            </p>
            <p>
                <a href="#notification-settings">Notification Settings</a> | 
                <a href="#privacy">Privacy Policy</a> | 
                <a href="#help">Help Center</a>
            </p>
            
            <div class="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Twitter">t</a>
                <a href="#" title="LinkedIn">in</a>
                <a href="#" title="Instagram">ig</a>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                © 2025 Your Social Media App. All rights reserved.<br>
                123 Social Street, City, State 12345<br>
                <a href="#unsubscribe" style="color: #999;">Unsubscribe from comment notifications</a>
            </p>
        </div>
    </div>
</body>
</html>`;
    },
    replyToComment: ({ firstName, repliedBy, }) => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reply to Comment</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .container {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      max-width: 550px;
      width: 100%;
      overflow: hidden;
      animation: fadeIn 0.6s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
      color: white;
      text-align: center;
      padding: 30px 20px;
    }

    .header h1 {
      font-size: 26px;
      font-weight: 700;
    }

    .content {
      padding: 30px;
    }

    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .message {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .replier {
      display: flex;
      align-items: center;
      background: #f0faff;
      border: 2px solid #cce7ff;
      border-radius: 12px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .avatar {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
      color: #fff;
      font-weight: 700;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }

    .details {
      flex: 1;
    }

    .name {
      font-weight: 700;
      font-size: 17px;
      color: #333;
      margin-bottom: 4px;
    }

    .action {
      font-size: 14px;
      color: #666;
    }

    .action-button {
      display: block;
      text-align: center;
      background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
      color: #fff;
      padding: 14px 0;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: 0.3s;
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 114, 255, 0.3);
    }

    .footer {
      text-align: center;
      font-size: 13px;
      color: #777;
      padding: 20px;
      border-top: 1px solid #eee;
    }

    @media (max-width: 600px) {
      .content { padding: 20px; }
      .header h1 { font-size: 22px; }
      .avatar { width: 45px; height: 45px; font-size: 18px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💬 New Reply to Your Comment</h1>
    </div>

    <div class="content">
      <div class="greeting" id="greeting"></div>
      <div class="message" id="message"></div>

      <div class="replier">
        <div class="avatar" id="avatar"></div>
        <div class="details">
          <div class="name" id="repliedBy">${repliedBy}</div>
          <div class="action">Replied to your comment</div>
        </div>
      </div>

      <a href="#" class="action-button">View Reply</a>
    </div>

    <div class="footer">
      © 2025 Socially. All rights reserved.
    </div>
  </div>
  <script>
      document.getElementById("message").textContent = "${repliedBy}" + "" + "just replied to your comment. Continue the conversation now.";
</script>


</body>
</html>
`;
    },
};
