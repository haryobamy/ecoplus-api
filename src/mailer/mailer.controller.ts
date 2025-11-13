import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDTO } from './dto/send-mail.dto';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async sendEmail(@Body() dto: SendEmailDTO) {
    return this.mailerService.sendEmail(dto);
  }
}
