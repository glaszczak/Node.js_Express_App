import { getTokenDescription } from 'config/tokenDescriptions';
import { LogCode, LoggerLevel } from 'enums';
import { Service, Token } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { QueryHandler } from './QueryHandler';

@Service()
export class QueryBus {
    private handlers = new Map<Token<QueryHandler<any, any>>, QueryHandler<any, any>>();

    registerQueryHandler<TQuery, TResult>(token: Token<QueryHandler<TQuery, TResult>>, handler: QueryHandler<TQuery, TResult>): void {
        this.handlers.set(token, handler);
    }

    async execute<TQuery, TResult>(token: Token<QueryHandler<TQuery, TResult>>, query: TQuery): Promise<TResult> {
        const handler = this.handlers.get(token);
        if (!handler) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: `No handler registered for token: ${getTokenDescription(token)}`,
                }),
            );

            throw new Error(LogCode.CODE_E001);
        }

        if (typeof handler.handle !== 'function') {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: `Registered handler for token: ${getTokenDescription(token)} is not a function`,
                }),
            );

            throw new Error(LogCode.CODE_E002);
        }

        try {
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: `Executing query handler for token: ${getTokenDescription(token)}`,
                }),
            );

            const result = await handler.handle(query);

            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: `Query handler executed successfully for token: ${getTokenDescription(token)}`,
                }),
            );

            return result;
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: `Error executing query handler for token: ${getTokenDescription(token)}`,
                    error: error,
                }),
            );

            throw new Error(LogCode.CODE_E003);
        }
    }
}
