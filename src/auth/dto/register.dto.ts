import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Jane Doe',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'jane@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Plain text password (minimum 6 characters)',
    minLength: 6,
    example: 'Password123#',
  })
  @MinLength(6)
  password: string;
}
