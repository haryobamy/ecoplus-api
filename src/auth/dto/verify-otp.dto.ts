import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '8f4a5f5a-0c82-4c0d-8c8b-6c5e2a7e4d11',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'One-time password sent to the user',
    example: '482913',
  })
  @IsNotEmpty()
  otp: string;
}

