import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'item'})
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'uuid' }) // Field is to tell graphql the type.
  id: string;
  @Column()
  @Field(() => String)
  name: string;
  @Column()
  @Field(() => Float)
  quantity: number;
  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  quantityUnists?: string // g, ml, kg
  // stores
  // user

}
