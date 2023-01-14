import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput } from './dto/inputs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    private getJwtToken(userId: string){
        return this.jwtService.sign({id: userId});
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse>{
       //! TODO: Crear un usuario
       const user = await this.usersService.create(signupInput);
       //! TODO: Crear jwt
       const token = this.getJwtToken(user.id);

        return{
            token,
            user
        }

    }
    async login(loginInput: LoginInput) : Promise<AuthResponse>{
        const { email, password } = loginInput;
        const payload = { field: "email", value: email};
        const user = await this.usersService.findOneField(payload);
        if(!bcrypt.compareSync(password, user.password)){
            throw new BadRequestException(`Email/Password do not match`);
        }
        const token = this.getJwtToken(user.id);
        return {
            token,
            user,
        }
    }
}
