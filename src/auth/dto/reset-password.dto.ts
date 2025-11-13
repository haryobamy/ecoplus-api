import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otp: string;

  @MinLength(6)
  password: string;
}
