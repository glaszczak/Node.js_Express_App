import { LoggerLevel } from 'enums';
import { logger, loggerMessage } from 'utils/logger';

export const handleMessagesForQueue1Topic1A = (msgContent: object) => {
    logger.log(
        LoggerLevel.INFO,
        loggerMessage({
            message: `Handling message for Queue1 Topic1A: ${JSON.stringify(msgContent)}`,
        }),
    );
};
