import { AuthService } from './../auth.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './../../users/entities/user.entity';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService,
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }
    async validate(payload: JwtPayload) : Promise<User>{
        const { id } = payload;
        const user = await this.authService.validateUser(id);
        console.log("payload is ", payload);
        console.log("user ", user);
        return user;
    }
}