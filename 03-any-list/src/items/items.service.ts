import { Item } from './entities/item.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ){}
  async create(createItemInput: CreateItemInput) : Promise<Item>{
    const newItem = this.itemRepository.create(createItemInput);
    return await this.itemRepository.save(newItem);
  }

  async findAll() : Promise<Item[]> {
    //! TODO: filtrar, paginar, por usuario...
    return await this.itemRepository.find();
    return [];
  }

  async findOne(id: string) : Promise<Item> {
    const item = await this.itemRepository.findOneBy({id});
    if(!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    await this.findOne(id);
    const item = await this.itemRepository.preload(updateItemInput);
    return this.itemRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    //!TODO: Soft delete, integridad referencial.
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
    return {...item, id};
  }
}
