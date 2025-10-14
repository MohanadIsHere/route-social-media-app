import { APP_NAME } from "../../config/env";
import { AvailabilityEnum } from "../../database/models";

export const emailTemplates = {
  verifyEmail: ({
    otp,
    firstName,
  }: {
    otp: string;
    firstName: string;
  }): string => {
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
    <p>Here is your verification code for <strong>${APP_NAME}</strong>:</p>
    <div class="otp">${otp}</div>
    <p class="note">This code will expire in 10 minutes. Do not share it with anyone.</p>
  </div>
</body>
</html>`;
  },
  sendEmailForResetPasswordOtp: ({
    otp,
    firstName,
  }: {
    otp: string;
    firstName: string;
  }): string => {
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
    <p>Here is your reset password otp for <strong>${APP_NAME}</strong>:</p>
    <div class="otp">${otp}</div>
    <p class="note">IF You didn't request for reset password otp, please ignore this message</p>
  </div>
</body>
</html>`;
  },

  welcomeEmail: ({
    firstName,
    website_url = "http://localhost:3000",
  }: {
    firstName: string;
    website_url?: string;
  }): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${APP_NAME}</title>
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
    <p>We’re excited to have you on board with <strong>${APP_NAME}</strong>.</p>
    <p>Start exploring your account and make the most out of our platform.</p>
    <a href="${website_url}" class="button">Get Started</a>
  </div>
</body>
</html>`;
  },
  passwordResetSuccessfullyEmail: ({
    firstName,
  }: {
    firstName: string;
  }): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${APP_NAME}</title>
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
    <p>We're glad to tell you that your password for <strong>${APP_NAME}</strong> has been updated successfully 🎉.</p>
    <p class="note">IF You didn't request for reset password otp, please contact us.</p>
  </div>
</body>
</html>`;
  },
  taggedInPost: ({
    taggedBy,
    postContent,
    firstName,
    postType,
  }: {
    taggedBy: string;
    postContent: string;
    firstName: string;
    postType: AvailabilityEnum;
  }) => {
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
};
