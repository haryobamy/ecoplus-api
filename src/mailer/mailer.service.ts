import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';
import { SendEmailDTO } from './dto/send-mail.dto';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: Mail;

  constructor() {
    // Initialize once for efficiency
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      service: process.env.SMTP_SERVICE || undefined,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /** ✅ Render EJS template with provided data */
  private async renderTemplate(
    templateName: string,
    data?: Record<string, any>,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '../templates',
      `${templateName}.ejs`,
    );
    try {
      return await ejs.renderFile(templatePath, data || {});
    } catch (error) {
      this.logger.error(
        `Template rendering failed for ${templateName}:`,
        error,
      );
      throw new InternalServerErrorException('Error rendering email template');
    }
  }

  /** ✅ Send Email */
  async sendEmail({
    from,
    recipients,
    subject,
    template,
    data,
    text,
  }: SendEmailDTO): Promise<string> {
    try {
      const html = await this.renderTemplate(template, data);

      const mailOptions: Mail.Options = {
        from:
          from || `"${process.env.APP_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: recipients,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`📧 Email sent: ${info.messageId} to ${recipients}`);
      return `Email sent successfully to ${recipients}`;
    } catch (error) {
      this.logger.error('❌ Email sending failed:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
