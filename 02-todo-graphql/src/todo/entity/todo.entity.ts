import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType() // Para decirle a Graphql como luce el objeto.
export class Todo {
    @Field(() => Int)
    id: number;
    @Field(() => String)
    description: string;
    @Field(() => Boolean)
    done: boolean = false;
}