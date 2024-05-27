import 'infrastructure/storages/database';

import { setupAxiosInterceptors } from 'config/axios';
import { ENV } from 'config/env';
import { LogCode, LoggerLevel } from 'enums';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { MySQLHealthCheck } from 'infrastructure/healthCheck/MySQLHealthCheck';
import { RabbitMqHealthCheck } from 'infrastructure/healthCheck/RabbitMqHealthCheck';
import { RabbitMqInitializer } from 'infrastructure/messaging/RabbitMqInitializer';
import routes from 'infrastructure/routes/router';
import { resolve } from 'path';
import Container from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(resolve('package.json'));

setupAxiosInterceptors();

const app = express();

app.use(express.json());

app.use(helmet());

async function initializeDependencies() {
    Container.set('RABBITMQ_URI', ENV.RABBITMQ.URI);
    Container.set('RABBITMQ_QUEUE_1', ENV.RABBITMQ.QUEUES[0]?.NAME);
    Container.set('RABBITMQ_QUEUE_2', ENV.RABBITMQ.QUEUES[1]?.NAME);

    try {
        const rabbitMqInitializer = Container.get(RabbitMqInitializer);

        await rabbitMqInitializer.initialize();

        logger.log(
            LoggerLevel.INFO,
            loggerMessage({
                message: 'RabbitMQ initialized successfully',
            }),
        );
    } catch (error) {
        logger.log(
            LoggerLevel.ERROR,
            loggerMessage({
                message: `Failed to initialize RabbitMQ: ${error instanceof Error ? error.message : error}`,
            }),
        );
        throw error;
    }
}

app.get('/check/ping', async (_: Request, res: Response) => {
    try {
        const mysqlHealth = await Container.get(MySQLHealthCheck).check();
        const rabbitHealth = await Container.get(RabbitMqHealthCheck).check();

        res.json({
            v: packageJson.version,
            mysql: mysqlHealth,
            rabbitMQ: rabbitHealth,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json(error.response || {});
    }
});

app.use('/api', routes);

app.get('*', (_, res) => res.status(404).json({ code: LogCode.CODE_G003 }));

export { app, initializeDependencies };
