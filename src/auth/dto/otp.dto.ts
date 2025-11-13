import { IsNotEmpty } from 'class-validator';

export class OtpDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  otp: string;
}
