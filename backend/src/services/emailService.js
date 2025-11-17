import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - UniSphere',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - UniSphere</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 UniSphere</h1>
            <p>Your Smart University Matching Assistant</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Thank you for signing up with UniSphere. To complete your registration and start your journey to finding the perfect university, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${data.verificationUrl}</p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with UniSphere, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EduPath AI. All rights reserved.</p>
            <p>This email was sent to ${data.email}. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${data.name}!
      
      Thank you for signing up with UniSphere. To complete your registration and start your journey to finding the perfect university, please verify your email address.
      
      Click the link below to verify your email:
      ${data.verificationUrl}
      
      This link will expire in 24 hours for security reasons.
      
      If you didn't create an account with UniSphere, you can safely ignore this email.
      
      Best regards,
      The EduPath AI Team
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request - UniSphere',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - UniSphere</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>UniSphere Account Security</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>We received a request to reset your password for your UniSphere account. If you made this request, click the button below to create a new password:</p>
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${data.resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request a password reset, please ignore this email</li>
                <li>Your password will remain unchanged if you don't click the link</li>
              </ul>
            </div>
            <p>If you have any questions or concerns, please contact our support team immediately.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EduPath AI. All rights reserved.</p>
            <p>This email was sent to ${data.email}. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${data.name}!
      
      We received a request to reset your password for your EduPath AI account. If you made this request, click the link below to create a new password:
      
      ${data.resetUrl}
      
      SECURITY NOTICE:
      - This link will expire in 1 hour for security reasons
      - If you didn't request a password reset, please ignore this email
      - Your password will remain unchanged if you don't click the link
      
      If you have any questions or concerns, please contact our support team immediately.
      
      Best regards,
      The EduPath AI Team
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to UniSphere! 🎓',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to UniSphere</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome to UniSphere!</h1>
            <p>Your Journey to the Perfect University Starts Here</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Welcome to UniSphere! We're excited to help you find your perfect university match. Your account has been successfully created and verified.</p>
            
            <h3>🚀 What you can do now:</h3>
            <div class="feature">
              <strong>📝 Create Your Academic Profile</strong><br>
              Tell us about your academic background, preferences, and goals
            </div>
            <div class="feature">
              <strong>🎯 Get Personalized Recommendations</strong><br>
              Receive university matches based on your profile and preferences
            </div>
            <div class="feature">
              <strong>🗺️ Generate Custom Roadmaps</strong><br>
              Get step-by-step guidance to reach your target universities
            </div>
            <div class="feature">
              <strong>💼 Career Guidance</strong><br>
              Explore career paths and get expert advice on your future
            </div>
            
            <a href="${data.dashboardUrl}" class="button">Start Your Journey</a>
            
            <p>Our AI-powered platform will analyze thousands of universities to find the ones that best match your academic profile, location preferences, budget, and career goals.</p>
            
            <p>If you have any questions or need assistance, our support team is here to help!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EduPath AI. All rights reserved.</p>
            <p>This email was sent to ${data.email}. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${data.name}!
      
      Welcome to UniSphere! We're excited to help you find your perfect university match. Your account has been successfully created and verified.
      
      What you can do now:
      - Create Your Academic Profile: Tell us about your academic background, preferences, and goals
      - Get Personalized Recommendations: Receive university matches based on your profile and preferences
      - Generate Custom Roadmaps: Get step-by-step guidance to reach your target universities
      - Career Guidance: Explore career paths and get expert advice on your future
      
      Start your journey: ${data.dashboardUrl}
      
      Our AI-powered platform will analyze thousands of universities to find the ones that best match your academic profile, location preferences, budget, and career goals.
      
      If you have any questions or need assistance, our support team is here to help!
      
      Best regards,
      The EduPath AI Team
    `
  })
};

// Send email function
export const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent = {};
    
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'UniSphere <noreply@unisphere.ai>',
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html || html,
      text: emailContent.text || text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to,
      subject: mailOptions.subject
    });

    return info;
  } catch (error) {
    logger.error('Failed to send email:', {
      error: error.message,
      to,
      subject
    });
    throw error;
  }
};

// Send bulk emails
export const sendBulkEmail = async (emails) => {
  const transporter = createTransporter();
  const results = [];

  for (const email of emails) {
    try {
      const info = await sendEmail(email);
      results.push({ success: true, messageId: info.messageId, to: email.to });
    } catch (error) {
      results.push({ success: false, error: error.message, to: email.to });
    }
  }

  return results;
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return false;
  }
};
