import { getTokenDescription } from 'config/tokenDescriptions';
import { LogCode, LoggerLevel } from 'enums';
import { Service, Token } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { CommandHandler } from './CommandHandler';

@Service()
export class CommandBus {
    private handlers = new Map<Token<CommandHandler<any>>, CommandHandler<any>>();

    registerCommandHandler<TCommand>(token: Token<CommandHandler<TCommand>>, handler: CommandHandler<TCommand>): void {
        this.handlers.set(token, handler);
    }

    async execute<TCommand>(token: Token<CommandHandler<TCommand>>, command: TCommand): Promise<void> {
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
                    message: `Executing command handler for token:  ${getTokenDescription(token)}`,
                }),
            );

            await handler.handle(command);

            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: `Command handler executed successfully for token:  ${getTokenDescription(token)}`,
                }),
            );
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: `Error executing command handler for token:  ${getTokenDescription(token)}`,
                    error: error,
                }),
            );

            throw new Error(LogCode.CODE_E003);
        }
    }
}
