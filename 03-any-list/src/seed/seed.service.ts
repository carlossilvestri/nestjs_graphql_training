import { CreateItemInput } from './../items/dto/inputs/create-item.input';
import { ItemsService } from './../items/items.service';
import { SEED_USERS, SEED_ITEMS } from './data/seed-data';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../users/entities/user.entity';
import { Item } from './../items/entities/item.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {
    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UsersService,
        private readonly itemService: ItemsService,
    ){
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        // Asegurarnos de que no estamos en production mode.
        if(this.isProd){
            throw new UnauthorizedException('executeSeed can not be executed on production')
        }
        // limpiar la base de datos. (BORRAR TODO)
        await this.deleteDatabase();
        // Crear usuarios.
        const user : User = await this.loadUsers();
        // Crear items
        await this.loadItems(user);

        return true;
    }

    async deleteDatabase(){
        // Borrar items
        await this.itemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        // Borrar usuarios
        await this.userRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
    }

    async loadUsers() : Promise<User> {
        const users = [];

        for (const user of SEED_USERS) {
            users.push(await this.userService.create(user));
        }
        return users[0];
    }

    async loadItems(user: User) : Promise<void> {
        const itemsPromises = [];
        for (const item of SEED_ITEMS) {
            itemsPromises.push(this.itemService.create(item, user));
        }
        await Promise.all(itemsPromises);
    }
}
