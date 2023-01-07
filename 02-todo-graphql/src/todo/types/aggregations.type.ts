import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({description: "Todo with aggregations"})
export class AggregationsType {
    @Field(()=> Int)
    total: number;
    @Field(()=> Int)
    pending: number;
    @Field(()=> Int)
    completed: number;
    @Field(()=> Int, { deprecationReason: "The most used is completed methods, do the same"})
    totalTodosCompleted: number;
}