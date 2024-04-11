import 'infrastructure/storages/database';

import { ENV } from 'config/env';
import { LoggerLevel } from 'enums';
import express from 'express';
import helmet from 'helmet';
import { RabbitMqInitializer } from 'infrastructure/messaging/RabbitMqInitializer';
import routes from 'infrastructure/routes/router';
import Container from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

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

app.use('/api', routes);

export { app, initializeDependencies };
