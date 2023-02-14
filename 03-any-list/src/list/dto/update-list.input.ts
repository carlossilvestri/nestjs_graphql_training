import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { CreateListInput } from './create-list.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
