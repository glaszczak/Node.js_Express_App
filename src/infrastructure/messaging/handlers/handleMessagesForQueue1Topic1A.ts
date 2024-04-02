import { LoggerLevel } from 'enums';
import { logger, loggerMessage } from 'utils/logger';

export const handleMessagesForQueue1Topic1A = (msgContent: string) => {
    logger.log;
    LoggerLevel.INFO,
        loggerMessage({
            message: `Handling message for Queue1 Topic1A: ${msgContent}`,
        });
};
