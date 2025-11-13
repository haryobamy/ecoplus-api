import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Address } from 'nodemailer/lib/mailer';

export class SendEmailDTO {
  @IsOptional()
  @IsString()
  from?: string;

  @IsArray()
  @IsNotEmpty()
  recipients: Address[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  template: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  data?: Record<string, any>;
}
