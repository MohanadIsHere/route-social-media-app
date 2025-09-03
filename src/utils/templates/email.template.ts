import { APP_NAME } from "../../config/env";

export const emailTemplates = {
  confirmEmail: ({
    otp,
    firstName,
    link,
  }: {
    otp: string;
    firstName: string;
    link: string;
  }) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - OTP Code</title>
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
        }

        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
        }

        .logo svg {
            width: 40px;
            height: 40px;
            fill: white;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }

        .content {
            padding: 50px 40px;
            text-align: center;
        }

        .greeting {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 40px;
        }

        .otp-container {
            background: linear-gradient(135deg, #f8f9ff 0%, #f1f3ff 100%);
            border: 2px dashed #667eea;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }

        .otp-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
        }

        .otp-label {
            font-size: 14px;
            color: #667eea;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }

        .otp-code {
            font-size: 48px;
            font-weight: 900;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
            position: relative;
            z-index: 1;
        }

        .otp-note {
            font-size: 14px;
            color: #888;
            margin-top: 15px;
            font-style: italic;
        }

        .instructions {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #667eea;
        }

        .instructions h3 {
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .instructions h3::before {
            content: '💡';
            margin-right: 10px;
        }

        .instructions ul {
            list-style: none;
            padding: 0;
        }

        .instructions li {
            color: #666;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }

        .instructions li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }

        .security-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
        }

        .security-notice h4 {
            color: #856404;
            font-size: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }

        .security-notice h4::before {
            content: '🔒';
            margin-right: 8px;
        }

        .security-notice p {
            color: #856404;
            font-size: 14px;
            line-height: 1.5;
        }

        .footer {
            background: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
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
            margin-top: 20px;
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

        .link-container {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            border: 2px solid #28a745;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }

        .link-label {
            font-size: 16px;
            color: #155724;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px 40px;
            font-size: 18px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 50px;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .verify-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(40, 167, 69, 0.4);
            background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
        }

        .link-note {
            font-size: 14px;
            color: #6c757d;
            margin-top: 15px;
            font-style: italic;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 30px 0;
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

            .otp-code {
                font-size: 36px;
                letter-spacing: 6px;
            }

            .greeting {
                font-size: 22px;
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
            <div class="logo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H5V21H19V9ZM7 11H17V13H7V11ZM7 15H17V17H7V15Z"/>
                </svg>
            </div>
            <h1>Email Verification</h1>
            <p>Secure your account with OTP verification</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hello ${firstName}! 👋</div>

            <div class="message">
                We received a request to verify your email address. To complete the verification process for ${APP_NAME}, please use either the One-Time Password (OTP) code below or click the verification button:
            </div>

            <!-- OTP Code Container -->
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-note">This code expires in 10 minutes</div>
            </div>

            <!-- Instructions -->
            <div class="instructions">
                <h3>How to use this code:</h3>
                <ul>
                    <li>Copy the 6-digit code above</li>
                    <li>Return to the verification page</li>
                    <li>Paste or type the code in the verification field</li>
                    <li>Click "Verify" to complete the process</li>
                </ul>
            </div>

            <!-- Alternative Verification Link -->
            <div class="link-container">
                <div class="link-label">Can't enter the code? Click the button below:</div>
                <a href="#verify-link" class="verify-button">Verify Email Address</a>
                <div class="link-note">This link will expire in 1 hour</div>
            </div>

            <div class="divider"></div>

            <!-- Security Notice -->
            <div class="security-notice">
                <h4>Security Notice</h4>
                <p>
                    For your security, never share this code with anyone. Our team will never ask for your verification code via email, phone, or text message. If you didn't request this verification, please ignore this email or contact our support team.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                This email was sent from a notification-only address that cannot accept incoming email. 
                Please do not reply to this message.
            </p>
            <p style="margin-top: 15px;">
                Need help? <a href="#support">Contact our support team</a> | 
                <a href="#privacy">Privacy Policy</a> | 
                <a href="#terms">Terms of Service</a>
            </p>
            
            <div class="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Twitter">t</a>
                <a href="#" title="LinkedIn">in</a>
                <a href="#" title="Instagram">ig</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © 2025 Your Company Name. All rights reserved.<br>
                123 Business Street, City, State 12345
            </p>
        </div>
    </div>
</body>
</html>`;
  },
  welcomeEmail: ({ firstName }: { firstName: string }) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - OTP Code</title>
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
        }

        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
        }

        .logo svg {
            width: 40px;
            height: 40px;
            fill: white;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }

        .content {
            padding: 50px 40px;
            text-align: center;
        }

        .welcome-message {
            font-size: 24px;
            font-weight: 600;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }

        .emoji-hand {
            -webkit-background-clip: unset !important;
            -webkit-text-fill-color: unset !important;
            color: #fdbf47;
        }

        .message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 40px;
        }

        .otp-container {
            background: linear-gradient(135deg, #f8f9ff 0%, #f1f3ff 100%);
            border: 2px dashed #667eea;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }

        .otp-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
        }

        .otp-label {
            font-size: 14px;
            color: #667eea;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }

        .otp-code {
            font-size: 48px;
            font-weight: 900;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            position: relative;
            z-index: 1;
        }

        .otp-note {
            font-size: 14px;
            color: #888;
            margin-top: 15px;
            font-style: italic;
        }

        .instructions {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
            border-left: 4px solid #667eea;
        }

        .instructions h3 {
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .instructions h3::before {
            content: '💡';
            margin-right: 10px;
        }

        .instructions ul {
            list-style: none;
            padding: 0;
        }

        .instructions li {
            color: #666;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }

        .instructions li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }

        .link-container {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            border: 2px solid #28a745;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }

        .link-label {
            font-size: 16px;
            color: #155724;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px 40px;
            font-size: 18px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 50px;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .verify-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(40, 167, 69, 0.4);
            background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
        }

        .link-note {
            font-size: 14px;
            color: #6c757d;
            margin-top: 15px;
            font-style: italic;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 30px 0;
        }

        .security-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
        }

        .security-notice h4 {
            color: #856404;
            font-size: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }

        .security-notice h4::before {
            content: '🔒';
            margin-right: 8px;
        }

        .security-notice p {
            color: #856404;
            font-size: 14px;
            line-height: 1.5;
        }

        .footer {
            background: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
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
            margin-top: 20px;
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

            .otp-code {
                font-size: 36px;
                letter-spacing: 6px;
            }

            .welcome-message {
                font-size: 22px;
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
            <div class="logo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H5V21H19V9ZM7 11H17V13H7V11ZM7 15H17V17H7V15Z"/>
                </svg>
            </div>
            <h1>Email Verification</h1>
            <p>Secure your account with OTP verification</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="welcome-message">Hello ${firstName}!</div>

            <div class="message">
                We received a request to verify your email address. To complete the verification process for ${APP_NAME}, please use either the One-Time Password (OTP) code below or click the verification button:
            </div>

            <!-- OTP Code Container -->
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">123456</div>
                <div class="otp-note">This code expires in 10 minutes</div>
            </div>

            <!-- Instructions -->
            <div class="instructions">
                <h3>How to use this code:</h3>
                <ul>
                    <li>Copy the 6-digit code above</li>
                    <li>Return to the verification page</li>
                    <li>Paste or type the code in the verification field</li>
                    <li>Click "Verify" to complete the process</li>
                </ul>
            </div>

            <!-- Alternative Verification Link -->
            <div class="link-container">
                <div class="link-label">Can't enter the code? Click the button below:</div>
                <a href="#verify-link" class="verify-button">Verify Email Address</a>
                <div class="link-note">This link will expire in 1 hour</div>
            </div>

            <div class="divider"></div>

            <!-- Security Notice -->
            <div class="security-notice">
                <h4>Security Notice</h4>
                <p>
                    For your security, never share this code with anyone. Our team will never ask for your verification code via email, phone, or text message. If you didn't request this verification, please ignore this email or contact our support team.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                This email was sent from a notification-only address that cannot accept incoming email. 
                Please do not reply to this message.
            </p>
            <p style="margin-top: 15px;">
                Need help? <a href="#support">Contact our support team</a> | 
                <a href="#privacy">Privacy Policy</a> | 
                <a href="#terms">Terms of Service</a>
            </p>
            
            <div class="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Twitter">t</a>
                <a href="#" title="LinkedIn">in</a>
                <a href="#" title="Instagram">ig</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © 2025 Your Company Name. All rights reserved.<br>
                123 Business Street, City, State 12345
            </p>
        </div>
    </div>
</body>
</html>
`;
  },
};
