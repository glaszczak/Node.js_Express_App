import { LoggerLevel } from 'enums';
import { logger, loggerMessage } from 'utils/logger';

export const handleMessagesForQueue2Topic2A = (msgContent: string) => {
    logger.log;
    LoggerLevel.INFO,
        loggerMessage({
            message: `Handling message for Queue2 Topic2A: ${msgContent}`,
        });
};
