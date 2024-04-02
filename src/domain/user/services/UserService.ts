import { CreateUserCommand } from 'application/commands/user/CreateUserCommand';
import { GetAllUsersQuery } from 'application/queries/user/GetAllUsersQuery';
import { GetUserByIdQuery } from 'application/queries/user/GetUserByIdQuery';
import { CreateUserCommandToken, GetAllUsersQueryToken, GetUserByIdQueryToken } from 'config/tokenDescriptions';
import { LogCode, LoggerLevel } from 'enums';
import { CommandBus } from 'infrastructure/cqrs/CommandBus';
import { QueryBus } from 'infrastructure/cqrs/QueryBus';
import { Service } from 'typedi';
import { ApiError, logger, loggerMessage } from 'utils/logger';

import { User } from '../User';

@Service()
export class UserService {
    constructor(
        private queryBus: QueryBus,
        private commandBus: CommandBus,
    ) {}

    async getAllUsers(): Promise<User[]> {
        try {
            const users = await this.queryBus.execute(GetAllUsersQueryToken, new GetAllUsersQuery());

            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'All users fetched successfully',
                }),
            );

            return users;
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'UserService.getAllUsers failed',
                    error: error,
                }),
            );

            throw new ApiError({
                statusCode: 400,
                response: {
                    code: LogCode.CODE_G001,
                },
            });
        }
    }

    async getUserById(userId: number): Promise<User | null> {
        try {
            const user = await this.queryBus.execute(GetUserByIdQueryToken, new GetUserByIdQuery(userId));
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'User fetched successfully by ID',
                }),
            );
            return user;
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'UserService.getUserById failed',
                    error: error,
                }),
            );

            throw new ApiError({
                statusCode: 400,
                response: { code: LogCode.CODE_G001, message: 'Error fetching user by ID' },
            });
        }
    }

    async createUser(userData: User): Promise<void> {
        try {
            await this.commandBus.execute(CreateUserCommandToken, new CreateUserCommand(userData));

            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'User created successfully',
                }),
            );
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'UserService.createUser failed',
                    error: error,
                }),
            );
            throw new ApiError({
                statusCode: 500,
                response: {
                    code: LogCode.CODE_G001,
                    message: 'Failed to create user due to an unexpected error',
                },
            });
        }
    }
}
