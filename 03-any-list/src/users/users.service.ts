import { Repository } from 'typeorm';
import { SignupInput } from './../auth/dto/inputs/signup.input';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}
  async create(signupInput: SignupInput) : Promise<User> {
    try {
      const newUser = await this.usersRepository.create(signupInput);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Algo salio mal ', error);
    }
  }

  async findAll() : Promise<User[]>{
    return [];
  }

  async findOne(id: string) : Promise<User>{
    throw new Error('Not implemented');
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  block(id: string): Promise<User> {
    throw new Error('Not implemented');
  }
}
