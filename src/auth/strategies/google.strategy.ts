import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_CALLBACK_URL'), // e.g., http://localhost:3000/auth/google/callback
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { emails, displayName, id } = profile;

    // Check if user already exists
    let user: any = await this.usersService.findAll();
    user = user.data.find(
      (u) => u.googleId === id || u.email === emails[0].value,
    );

    if (!user) {
      // Create new user
      user = await this.usersService.create({
        fullName: displayName,
        email: emails[0].value,
        password: '', // empty because Google login
        isVerified: true,
        googleId: id,
      });
    } else if (!user.googleId) {
      // Update existing user with googleId
      await this.usersService.update(user.id, {
        googleId: id,
        isVerified: true,
      });
    }

    done(null, user);
  }
}
