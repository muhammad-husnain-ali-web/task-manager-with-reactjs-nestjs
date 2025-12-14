import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailsService {
    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,       // your Gmail
                pass: process.env.EMAIL_PASS,   // App password
            },
        });
    }

    async sendmail(purpose: string, name: string, email: string, otp: string) {

        try {

            const { subject, html } = this.generateOtpEmail(purpose, name, otp)
            const mailOptions = {
                from: `"Nestjs" <${process.env.EMAIL_USER}>`,
                to: email,
                subject,
                html
            };
            const info = await this.transporter.sendMail(mailOptions)
            return info

        } catch (error) {
                throw error
        }
    }

    generateOtpEmail(purpose: string, name: string, otp: string) {
        let subject = "";
        let intro = "";

        switch (purpose) {
            case "register":
                subject = "Verify your email";
                intro = `Thank you for registering with <b>TaskManager</b>. To complete your registration, please verify your email address using the OTP below:`;
                break;

            case "login":
                subject = "Login Verification OTP";
                intro = `We noticed a login attempt to your <b>TaskManager</b> account. For your security, please confirm it’s you by entering the OTP below:`;
                break;

            case "forgot-password":
                subject = "Password Reset OTP";
                intro = `We received a request to reset your <b>TaskManager</b> account password. Use the OTP below to proceed:`;
                break;
        }

        const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color:#f9f9f9;">
      <h2 style="color:#0084d6;">Hello, <b>${name}</b> 👋</h2>
      <p>${intro}</p>
      
      <div style="text-align:center; margin: 20px 0;">
        <span style="font-size:22px; font-weight:bold; color:#333; border:2px dashed #0084d6; padding:10px 20px; border-radius:8px;">
          ${otp}
        </span>
      </div>

      <p>This OTP will expire in <b>5 minutes</b>.</p>
      <p>If you did not request this, please ignore this email.</p>
      
      <hr style="margin:20px 0;">
      <p style="font-size:12px; color:#555;">
        Regards, <br/>
        The <b>TaskManager</b> Team
      </p>
    </div>
  `;

        return { subject, html };
    }

}
