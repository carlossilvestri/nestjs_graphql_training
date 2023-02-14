import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateListInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}
