import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsPositive, IsOptional } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  // @Field(() => Float)
  // @IsPositive()
  // quantity: number;

  @Field(() => String, {nullable: true})
  @IsString()
  @IsOptional()
  category?: string; 

  @Field(() => String, { nullable: true})
  @IsString()
  @IsOptional()
  quantityUnists?: string // g, ml, kg
}
