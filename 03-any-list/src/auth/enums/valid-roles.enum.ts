import { registerEnumType } from "@nestjs/graphql";

//! todo: Implementar enum como GraphQL Enum Type.
export enum ValidRoles {
    admin = 'admin',
    user = 'user',
    superUser = 'superUser',
}
registerEnumType(ValidRoles, { name: 'ValidRoles', description: 'Allowed or valid roles'})