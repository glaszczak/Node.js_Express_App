import { LoggerLevel } from 'enums';
import { app, initializeDependencies } from 'infrastructure/api/express/app';
import { logger, loggerMessage } from 'utils/logger';

async function startServer() {
    try {
        await initializeDependencies();

        const port = process.env.EXPRESS_PORT || 3000;
        app.listen(port, () => {
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: `App running at port ${port}`,
                }),
            );
        });
    } catch (error) {
        logger.log(
            LoggerLevel.ERROR,
            loggerMessage({
                message: 'Failed to start the server.',
            }),
        );
        process.exit(1);
    }
}

startServer();
