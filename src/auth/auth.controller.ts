import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async reate(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('verified-otp')
  async verifyOtp(@Body() Body: { userId: string; otp: string }) {
    return this.authService.verifyOtp(Body.userId, Body.otp);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('reset-request')
  async resetRequest(@Body() body: ResetPasswordRequestDto) {
    return this.authService.resetPasswordRequest(body.email);
  }
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.email, body.otp, body.password);
  }

  // Redirect user to Google login page
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Passport handles redirect
  }

  // Google OAuth callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    // Successful login, generate JWT for client
    const user = req.user;
    const token = await this.authService.generateJwtForGoogle(user);

    // redirect to frontend with token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${token}`,
    );
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard)
  ProtectedRoute(@Req() req) {
    return {
      message: 'You have accessed a protected route',
      user: req.user,
    };
  }
}
