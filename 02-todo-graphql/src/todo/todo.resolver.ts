import { TodoService } from './todo.service';
import { Args, Query, Int, Mutation } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput } from './dto/inputs/create-todo.input';

@Resolver()
export class TodoResolver {
    constructor(
        private readonly todoService: TodoService,
    ) { }
    @Query(() => [Todo], { name: "todos" })
    findAll(): Todo[] {
        return this.todoService.findAll();
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
        console.log({ createTodoInput });
        return null;
    }
}
