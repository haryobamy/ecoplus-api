import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt-ts';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { UsersService } from 'src/users/users.service';
import { generateOtp, otpExpiry } from 'src/utils/otp.util';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}
  async register(createAuthDto: RegisterDto) {
    try {
      const otp = generateOtp();
      const expiry = otpExpiry();

      const user = await this.userService.create({
        ...createAuthDto,
        passwordHash: createAuthDto.password,
      });

      await this.userService.update(user.data.id, {
        otpCode: otp,
        otpExpiry: expiry,
      });

      await this.userService.sendVerificationOtpEmail({
        recipients: [user?.data?.email],
        subject: 'Your OTP Code',
        template: 'otp-mail',
        data: { name: user?.data?.fullName, otp: user?.data?.otpCode },
      });

      //TODO: send otp email
      return {
        message: 'User registered successfully, OTP sent',
        status: true,
        data: {
          ...user.data,
        },
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async verifyOtp(userId: string, otp: string) {
    try {
      const user: any = await this.userService.findOne(userId);
      if (!user) throw new Error('User not found');
      if (user.otpCode !== otp || user.otpExpiry < new Date())
        throw new Error('Invalid or expired OTP');

      await this.userService.update(userId, {
        isVerified: true,
        otpCode: null,
        otpExpiry: null,
      });
      return { message: 'OTP verified successfully', status: true };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
  async login(email: string, password: string) {
    try {
      const matchedUser = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!matchedUser) throw new Error('User not found');
      if (!matchedUser.isVerified) throw new Error('User not verified');

      const valid = await compare(password, matchedUser.passwordHash);
      if (!valid) throw new Error('Invalid password');

      const token = this.jwtService.sign({
        sub: matchedUser.id,
        email: matchedUser.email,
      });
      return {
        message: 'Login successful',
        status: true,
        data: {
          token,
        },
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async resetPasswordRequest(email: string) {
    try {
      const user: any = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error('User not found');

      const otp = generateOtp();
      const expiry = otpExpiry();

      await this.userService.update(user.id, {
        otpCode: otp,
        otpExpiry: expiry,
      });
      // TODO: send OTP email
      return { message: 'Reset password OTP sent', status: true };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    try {
      const user: any = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error('User not found');

      if (user.otpCode !== otp || user.otpExpiry < new Date())
        throw new Error('Invalid OTP');
      const passwordHash = await hash(newPassword, 10);

      await this.userService.update(user.id, {
        passwordHash,
        otpCode: null,
        otpExpiry: null,
      });
      return { message: 'Password reset successfully', status: true };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async generateJwtForGoogle(user: any) {
    try {
      const payload = { sub: user.id, email: user.email, role: user.role };
      return this.jwtService.sign(payload);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}
