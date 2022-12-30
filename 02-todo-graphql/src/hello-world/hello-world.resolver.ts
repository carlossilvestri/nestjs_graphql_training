import { Int, Float, Query, Resolver, Args } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
    @Query(() => String, { description: "Hola Mundo es lo que retorna"})
    helloWorld() : string {
        return 'Hello World!';
    }
    @Query(() => Float, { name: "randomNumber"})
    getRandomNumber() : number {
        return Math.random() * 100
    }
    @Query(() => Int, { name: "randomFromZeroTo", description: "From Zero to argument to (default 6)"})
    getRandomFromZeroTo(
        // nullable: true le decimos que el parametro to es opcional.
        @Args("to", { nullable: true, type: () => Int}) to: number = 6) : number {
        return Math.floor(Math.random() * to) + 1;
    }
}
