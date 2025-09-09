import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key', // лучше вынести в .env
    });
  }

  async validate(payload: any) {
    // payload = то, что ты зашифровал в токене
    return { id: payload.sub, email: payload.email, fullName: payload.fullName };
  }
}
