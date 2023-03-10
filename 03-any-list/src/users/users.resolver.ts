import { List } from './../list/entities/list.entity';
import { ListService } from './../list/list.service';
import { SearchArgs } from './../common/dto/args/search.args';
import { PaginationArgs } from './../common/dto/args';
import { Item } from './../items/entities/item.entity';
import { ItemsService } from './../items/items.service';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { SignupInput } from './../auth/dto/inputs/signup.input';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listService: ListService,
    ) { }

  createUser(@Args('signupInput') signupInput: SignupInput) {
    return this.usersService.create(signupInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User[]> {
    return await this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User> {
    //! TODO
    return await this.usersService.findOne({ field: 'id', value: id });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
    ) {
    return await this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @Parent() user: User,
  ) : Promise<number> {
    return this.itemService.itemCountByUser(user);
  }
  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) : Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, searchArgs);
  }


  @ResolveField(() => Int, { name: 'listCount' })
  async listCount(
    @Parent() user: User,
  ) : Promise<number> {
    return this.listService.countByUser(user);
  }

  @ResolveField(() => [List], { name: 'lists' })
  async getListsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) : Promise<List[]> {
    return this.listService.findAll(user, paginationArgs, searchArgs);
  }
}
