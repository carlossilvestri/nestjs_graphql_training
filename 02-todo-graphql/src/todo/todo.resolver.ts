import { AggregationsType } from './types/aggregations.type';
import { TodoService } from './todo.service';
import { Args, Query, Int, Mutation } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput, StatusArgs, UpdateTodoInput } from './dto';

@Resolver(() => Todo)
export class TodoResolver {
    constructor(
        private readonly todoService: TodoService,
    ) { }
    @Query(() => [Todo], { name: "todos" })
    findAll(
        @Args() statusArgs: StatusArgs,
        //! Tarea: Args //
    ): Todo[] {
        return this.todoService.findAll(statusArgs);
    }
    @Query(() => Todo, { name: "todo" })
    findOne(
        @Args("id", { nullable: false, type: () => Int }) id: number
    ): Todo {
        return this.todoService.findOne(id);
    }
    @Mutation(() => Todo, { name: "createTodo" })
    create(
        @Args("createTodoInput") createTodoInput: CreateTodoInput
    ) {
        return this.todoService.create(createTodoInput);
    }
    @Mutation(() => Todo, { name: "updateTodo" })
    update(
        @Args("updateTodoInput") updateTodoInput: UpdateTodoInput
    ) {
       return this.todoService.update(updateTodoInput);
    }
    @Mutation(() => Boolean)
    remove(
        @Args("id",{ type: ()=> Int}) id: number
    ){
        return this.todoService.remove(id);
    }
    // Aggregations
    @Query(() => Int, { name: 'totalTodos'})
    totalTodos() : number{
        return this.todoService.totalTodos;
    }
    @Query(() => Int, { name: 'completedTodos'})
    completedTodos() : number{
        return this.todoService.completedTodos;
    }
    @Query(() => Int, { name: 'pendingTodos'})
    pendingTodos() : number{
        return this.todoService.pendingTodos;
    }
    @Query(() => AggregationsType)
    aggregations() : AggregationsType {
        return {
            completed: this.todoService.completedTodos,
            pending: this.todoService.pendingTodos,
            total: this.todoService.totalTodos,
            totalTodosCompleted: this.todoService.totalTodos,
        }
    }
}
