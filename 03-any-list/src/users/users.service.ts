import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignupInput } from './../auth/dto/inputs/signup.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

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

  async findAll(roles: ValidRoles[]) : Promise<User[]>{
    if(!roles.length) return await this.usersRepository.find(
      /*
      // No es necesario porque tenemos lazy en la entidad.
      {
      relations: {
        lastUpdateBy: true
      }
    }
    */
    );
    console.log("hola mundo");
    return await this.usersRepository.createQueryBuilder().andWhere('ARRAY[roles] && ARRAY[:...roles]').setParameter('roles', roles).getMany();
  }
  async findOne(payload: { field: string, value: string}) : Promise<User>{
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
  async update(id: string, updateUserInput: UpdateUserInput, updatedBy: User) : Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id
      });
      user.lastUpdateBy = updatedBy;
      return await this.usersRepository.save(user);
    } catch (error) {
      // manejar error
      console.log("error ", error);
      this.handleDBErrors(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOne({field: 'id', value: id});
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.usersRepository.save(userToBlock);
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
