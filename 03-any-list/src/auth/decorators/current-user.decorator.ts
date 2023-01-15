import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext, InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator((roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user : User = ctx.getContext().req.user;
    if(!user){
        throw new InternalServerErrorException(`No user inside the request - make sure that we use the AuthGuard`);
    }
    if(!roles.length) return user;
    for(const role of user.roles){
        //! TODO: Eliminar Valid Roles
        if(roles.includes(role as ValidRoles)){
            return user;
        }
    }
    throw new ForbiddenException(`User ${user.fullName} has role ${user.roles.join(', ')}, but need role: ${roles.join(' or ')} to see this endpoint`);
})