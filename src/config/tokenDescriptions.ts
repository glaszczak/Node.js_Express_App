import { CreateUserCommand } from 'application/commands/user/CreateUserCommand';
import { GetAllUsersQuery } from 'application/queries/user/GetAllUsersQuery';
import { GetUserByIdQuery } from 'application/queries/user/GetUserByIdQuery';
import { User } from 'domain/user/User';
import { Token } from 'typedi';

import { CommandHandler } from '../infrastructure/cqrs/CommandHandler';
import { QueryHandler } from '../infrastructure/cqrs/QueryHandler';

export const GetAllUsersQueryToken = new Token<QueryHandler<GetAllUsersQuery, User[]>>();
export const GetUserByIdQueryToken = new Token<QueryHandler<GetUserByIdQuery, User | null>>();
export const CreateUserCommandToken = new Token<CommandHandler<CreateUserCommand>>();

export const tokenDescriptions = new Map<Token<any>, string>([
    [GetAllUsersQueryToken, 'GetAllUsersQueryToken'],
    [GetUserByIdQueryToken, 'GetUserByIdQueryToken'],
    [CreateUserCommandToken, 'CreateUserCommandToken'],
]);

export function getTokenDescription(token: Token<any>): string {
    return tokenDescriptions.get(token) || 'Unknown Token';
}
