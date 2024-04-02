import { LogCode, LogCodeDictionary, LoggerLevel } from 'enums';
import { CommandHandler } from 'infrastructure/cqrs/CommandHandler';
import { AppDataSource } from 'infrastructure/storages/database';
import { Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { CreateUserCommand } from './CreateUserCommand';

@Service()
export class CreateUserCommandHandler implements CommandHandler<CreateUserCommand> {
    async handle(command: CreateUserCommand): Promise<void> {
        try {
            const { userData } = command;
            await AppDataSource.query('CALL CreateUser(?, ?)', [userData.user_name, userData.email]);

            logger.log(LoggerLevel.INFO, loggerMessage({ message: 'User created successfully' }));
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    name: 'CreateUserCommandHandler',
                    message: LogCodeDictionary.CODE_E006,
                    error: error,
                }),
            );

            throw new Error(LogCode.CODE_E006);
        }
    }
}
