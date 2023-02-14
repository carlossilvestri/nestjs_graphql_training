import { PaginationArgs, SearchArgs } from './../common/dto/args';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem'})
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
    ): Promise<Item> {
    return await this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ) : Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Item, { name: 'itemByIdAndUserLogged' })
  findOneByIdAndUser(
    @Args('id', { type: () => ID, name: 'itemId' }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
    ) : Promise<Item> {
    return this.itemsService.findOneByIdAndUser(id, user);
  }
  @Query(() => Item, { name: 'itemById' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin,ValidRoles.superUser]) user: User
    ) : Promise<Item> {
    return this.itemsService.findOne(id);
  }
  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User
    ) {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
    ): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
