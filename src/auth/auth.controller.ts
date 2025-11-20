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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ResetPasswordDto,
  ResetPasswordRequestDto,
} from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and send verification OTP' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully, OTP sent to email',
  })
  @ApiBadRequestResponse({ description: 'Invalid input or duplicate user' })
  async register(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP sent to the user email' })
  @ApiOkResponse({ description: 'OTP verified successfully' })
  @ApiBadRequestResponse({ description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.userId, body.otp);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'User not verified' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('reset-request')
  @ApiOperation({ summary: 'Initiate password reset by sending OTP' })
  @ApiOkResponse({ description: 'Reset password OTP sent' })
  @ApiBadRequestResponse({ description: 'User not found' })
  async resetRequest(@Body() body: ResetPasswordRequestDto) {
    return this.authService.resetPasswordRequest(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'Invalid OTP or user not found' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.email, body.otp, body.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login page' })
  async googleLogin() {
    // Passport handles redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback handler' })
  @ApiResponse({
    status: 302,
    description: 'Redirects back to frontend with JWT token',
  })
  async googleLoginCallback(@Req() req, @Res() res) {
    const user = req.user;
    const token = await this.authService.generateJwtForGoogle(user);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?token=${token}`,
    );
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Example protected route requiring JWT' })
  @ApiOkResponse({ description: 'Access granted to protected route' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  ProtectedRoute(@Req() req) {
    return {
      message: 'You have accessed a protected route',
      user: req.user,
    };
  }
}
