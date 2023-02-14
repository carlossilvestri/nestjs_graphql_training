import { ListItem } from './../../list-item/entities/list-item.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'list'})
@ObjectType()
export class List {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Id of the list' })
  id: string;

  @Column()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() =>User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, {lazy:true})
  @Field(() => [ListItem])
  listItem: ListItem[];
}
