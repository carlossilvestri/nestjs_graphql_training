import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignupInput } from './../auth/dto/inputs/signup.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private logger : Logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}
  async create(signupInput: SignupInput) : Promise<User> {
    try {
      const newUser = await this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() : Promise<User[]>{
    return [];
  }

  async findOne(id: string) : Promise<User>{
    throw new Error('Not implemented');
  }
  async findOneField(payload: { field: string, value: string}) : Promise<User>{
    try {
      const { field, value } = payload;
      return await this.usersRepository.findOneByOrFail({[field]: value});
    } catch (error) {
      if(error?.message.includes("Could not find")){
        const newError = {
          code: 'not-found',
          detail: error.message
        }
        this.handleDBErrors(newError);
      }
      this.handleDBErrors(error);
    }
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

  private handleDBErrors(error: any): never{
    switch (error?.code) {
      case '23505':
        throw new BadRequestException(error?.detail.replace('Key', ''));
        break;
      case 'not-found':
          throw new NotFoundException(error?.detail);
          break;
      default:
        this.logger.error(error);
        throw new InternalServerErrorException('Please check server logs');
        break;
    }
  }
}
