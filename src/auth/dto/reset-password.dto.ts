import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'Email address requesting the password reset',
    example: 'jane@example.com',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address requesting the password reset',
    example: 'jane@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'OTP sent to the email address',
    example: '482913',
  })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'New password to set',
    example: 'NewPassword123#',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
