import { UpdateItemInput } from './../items/dto/inputs/update-item.input';
import { SearchArgs } from './../common/dto/args/search.args';
import { PaginationArgs } from './../common/dto/args/pagination.args';
import { User } from 'src/users/entities/user.entity';
import { List } from './entities/list.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { Repository } from 'typeorm';

@Injectable()
export class ListService {

  constructor(
    @InjectRepository(List)
    private readonly listRespository : Repository<List>
  ){}

  async create(createListInput: CreateListInput, user: User) : Promise<List>{
    const newList = this.listRespository.create({
      ...createListInput,
      user
    });
    return await this.listRespository.save(newList);
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs) : Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRespository.createQueryBuilder()
        .take(limit)
        .skip(offset)
        .where(`"userId" = :userId`, { userId: user.id })
    if(search){
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search.toLowerCase()}%`})
    }
    return queryBuilder.getMany();
  }
  async findOneByIdAndUser(id: string, user: User) : Promise<List> {
    const list = await this.listRespository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });
    if(!list) throw new NotFoundException(`list ${id} not found for your user`);
    return list;
  }
  async findOne(id: string) : Promise<List> {
    const list = await this.listRespository.findOneBy({id});
    if(!list) throw new NotFoundException(`list ${id} not found`);
    return list;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<List> {
    await this.findOneByIdAndUser(id, user);
    const list = await this.listRespository.preload(updateItemInput);
    return this.listRespository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    //!TODO: Soft delete, integridad referencial.
    const list = await this.findOneByIdAndUser(id, user);
    await this.listRespository.remove(list);
    return {...list, id};
  }
  async countByUser(user: User) : Promise<number> {
    return this.listRespository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }
}
