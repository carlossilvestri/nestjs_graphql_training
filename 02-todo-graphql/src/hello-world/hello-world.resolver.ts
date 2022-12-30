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
    @Query(() => Int, { name: "randomFromZeroTo", description: "From Zero to argument to"})
    getRandomFromZeroTo(@Args("to") to: number) : number {
        return Math.floor(Math.random() * to) + 1;
    }
}
