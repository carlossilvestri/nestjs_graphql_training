import { Item } from './../../items/entities/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { List } from './../../list/entities/list.entity';

@Entity('listItem')
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Id of the list item' })
  id: string;

  @Column({ type: 'numeric'})
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'boolean'})
  @Field(() => Boolean)
  completed: boolean;

  // Relaciones
  @ManyToOne(() => List, (list) => list.listItem, { lazy: true})
  // @Field(() => List)
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true})
  @Field(() => Item)
  item: Item;
}
