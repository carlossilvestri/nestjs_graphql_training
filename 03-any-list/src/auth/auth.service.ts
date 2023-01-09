import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ){}

    async signup(signupInput: SignupInput): Promise<AuthResponse>{
       //! TODO: Crear un usuario
       const user = await this.usersService.create(signupInput);
       //! TODO: Crear jwt
       const token = 'ABC123';

        return{
            token,
            user
        }

    }
}
