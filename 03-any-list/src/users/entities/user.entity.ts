import { Item } from './../../items/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity({name: 'user'})
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column()
  @Field(() => String)
  fullName: string;
  @Column({unique: true})
  @Field(() => String)
  email: string;
  @Column()
  // @Field(() => String)
  password: string;
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String])
  roles: string[];
  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;
  //! TODO: Relaciones
  @ManyToOne(() => User, (user: User) =>user.lastUpdateBy, {nullable: true, lazy: true})
  @JoinColumn({name: 'lastUpdateBy'})
  @Field(() => User, {nullable: true})
  lastUpdateBy?: User;

  @OneToMany(() => Item, (item: Item) => item.user, { lazy: true})
  @Field(() => [Item])
  items: Item[];
}
