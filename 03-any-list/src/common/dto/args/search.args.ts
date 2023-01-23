import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SearchArgs {
    @Field(()=> String, { nullable: true})
    @IsOptional()
    @IsString()
    search?: string;
}