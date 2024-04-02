import { User } from 'domain/user/User';
import { LogCode, LogCodeDictionary, LoggerLevel } from 'enums';
import { QueryHandler } from 'infrastructure/cqrs/QueryHandler';
import { AppDataSource } from 'infrastructure/storages/database';
import { Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { GetAllUsersQuery } from './GetAllUsersQuery';

@Service()
export class GetAllUsersQueryHandler implements QueryHandler<GetAllUsersQuery, User[] | null> {
    async handle(): Promise<User[]> {
        try {
            const result = await AppDataSource.query('CALL GetAllUsers()');
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'GetAllUsers procedure called successfully.',
                }),
            );
            return result;
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    name: 'GetAllUsersQueryHandler',
                    message: LogCodeDictionary.CODE_E004,
                    error: error,
                }),
            );

            throw new Error(LogCode.CODE_E004);
        }
    }
}
