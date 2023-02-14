import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from './../common/dto/args/';
import { User } from 'src/users/entities/user.entity';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ){}
  async create(createItemInput: CreateItemInput, user: User) : Promise<Item>{
    const newItem = this.itemRepository.create({
      ...createItemInput,
      user
    });
    return await this.itemRepository.save(newItem);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs) : Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    console.log(search);
    const queryBuilder = this.itemRepository.createQueryBuilder()
        .take(limit)
        .skip(offset)
        .where(`"userId" = :userId`, { userId: user.id })
    if(search){
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%`})
    }
    return queryBuilder.getMany();
    /*
    // Without query builder
    return await this.itemRepository.find({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: user.id
        },
        name: Like(`%${search?.toLowerCase()}%`),
      }
    });
    */
  }

  async findOne(id: string) : Promise<Item> {
    const item = await this.itemRepository.findOneBy({id});
    if(!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }
  async findOneByIdAndUser(id: string, user: User) : Promise<Item> {
    const item = await this.itemRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });
    if(!item) throw new NotFoundException(`Item ${id} not found for your user`);
    return item;
  }
  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOneByIdAndUser(id, user);
    const item = await this.itemRepository.preload(updateItemInput);
    return this.itemRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    //!TODO: Soft delete, integridad referencial.
    const item = await this.findOneByIdAndUser(id, user);
    await this.itemRepository.remove(item);
    return {...item, id};
  }


  async itemCountByUser(user: User) : Promise<number> {
    return this.itemRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }
}
