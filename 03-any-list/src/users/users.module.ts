import { ItemsModule } from './../items/items.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User]), ItemsModule],
  exports: [TypeOrmModule, UsersResolver, UsersService]
})
export class UsersModule {}
