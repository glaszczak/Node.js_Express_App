import { User } from 'domain/user/User';
import { LogCode, LogCodeDictionary, LoggerLevel } from 'enums';
import { QueryHandler } from 'infrastructure/cqrs/QueryHandler';
import { AppDataSource } from 'infrastructure/storages/database';
import { Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { GetUserByIdQuery } from './GetUserByIdQuery';

@Service()
export class GetUserByIdQueryHandler implements QueryHandler<GetUserByIdQuery, User | null> {
    async handle(query?: GetUserByIdQuery): Promise<User | null> {
        try {
            const userId = query?.userId;
            const result = await AppDataSource.query('CALL GetUserById(?)', [userId]);
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: `GetUserById procedure called successfully for user ID: ${userId}`,
                }),
            );
            return result[0][0] || null;
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    name: 'GetUserByIdQueryHandler',
                    message: `${LogCodeDictionary.CODE_E005} for user ID: ${query?.userId}`,
                    error: error,
                }),
            );

            throw new Error(LogCode.CODE_E005);
        }
    }
}
