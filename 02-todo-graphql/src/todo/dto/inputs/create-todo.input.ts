import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTodoInput {
    @Field(() => String, { description: "What needs to be done"})
    description: string;
}