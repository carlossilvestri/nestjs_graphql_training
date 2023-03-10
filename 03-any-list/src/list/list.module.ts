import { List } from './entities/list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';

@Module({
  providers: [ListResolver, ListService],
  imports: [
    TypeOrmModule.forFeature([List])
  ],
  exports: [
    TypeOrmModule,
    ListService,
  ]
})
export class ListModule {}
