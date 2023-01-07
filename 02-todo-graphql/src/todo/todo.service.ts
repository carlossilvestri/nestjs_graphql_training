import { CreateTodoInput, StatusArgs, UpdateTodoInput } from './dto';
import { Todo } from './entity/todo.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TodoService {
    private todos: Todo[] = [
        {
            id: 1,
            description: "Piedra del alma",
            done: false,
        },
        {
            id: 2,
            description: "Piedra del Espacio",
            done: true,
        },
        {
            id: 3,
            description: "Piedra del Poder",
            done: false,
        }
    ]
    get totalTodos(){
        return this.todos.length;
    }
    get completedTodos(){
        return this.todos.filter(todo => todo.done).length;
    }
    get pendingTodos(){
        return this.todos.filter(todo => !todo.done).length;
    }
    findAll(statusArgs: StatusArgs): Todo[] {
        const { status } =  statusArgs;
        if(status !== undefined) return this.todos.filter(todo => todo.done === status);
        return this.todos;
    }
    findOne(id: number): Todo {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);
        return todo;
    }
    create(createTodoInput: CreateTodoInput): Todo {
        const todo = new Todo();
        todo.description = createTodoInput.description;
        todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
        this.todos.push(todo);
        return todo;
    }
    update(updateTodoInput: UpdateTodoInput) {
        const { id, description, done } = updateTodoInput;
        const todoUpdate = this.findOne(id);
        if (description) todoUpdate.description = description;
        if (done !== undefined) todoUpdate.done = done;
        this.todos = this.todos.map(todo => {
            return (todo.id === id) ? todoUpdate : todo;
        });
        return todoUpdate;

    }
    remove(id: number) : Boolean {
        this.findOne(id);
        this.todos = this.todos.filter(todo => todo.id !== id);
        return true;
    }
}
