import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Tell passport where to find the JWT in the request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Don’t ignore expiration (token expires as defined)
      ignoreExpiration: false,

      // Secret key for verifying JWT signatures
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'default_secret',
    });
  }

  /**
   * validate() is automatically called by Passport after token verification.
   * The returned value gets attached to the request object as `req.user`.
   */
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
