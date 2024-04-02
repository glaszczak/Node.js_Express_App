import { rabbitMQConfig } from 'config/rabbitmqConfig';
import { LoggerLevel } from 'enums';
import { Inject, Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { RabbitMQConsumer } from './RabbitMQConsumer';
import { RabbitMQProducer } from './RabbitMQProducer';
import { RabbitMQService } from './RabbitMQService';

@Service()
export class RabbitMQInitializer {
    @Inject(() => RabbitMQService)
    private rabbitMQService: RabbitMQService;

    @Inject(() => RabbitMQConsumer)
    private rabbitMQConsumer: RabbitMQConsumer;

    @Inject(() => RabbitMQProducer)
    private rabbitMQProducer: RabbitMQProducer;

    @Inject('RABBITMQ_URI')
    private rabbitMqUri: string;

    async initialize() {
        if (!this.rabbitMqUri) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'RabbitMQ URI not defined in environment variables.',
                }),
            );

            throw new Error('RabbitMQ URI not defined in environment variables.');
        }

        try {
            await this.rabbitMQService.connect(this.rabbitMqUri);

            if (this.rabbitMQService.isConnected()) {
                await this.rabbitMQConsumer.initialize();

                await this.setupTopicExchangeAndQueues();

                await this.rabbitMQProducer.initialize();

                logger.log(
                    LoggerLevel.INFO,
                    loggerMessage({
                        message: 'RabbitMQ communication initialized with topic exchange.',
                    }),
                );
            } else {
                throw new Error('Unable to initialize RabbitMQ communication due to connection issues');
            }
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: `Failed to initialize RabbitMQ communication: ${error}`,
                }),
            );
        }
    }

    async setupTopicExchangeAndQueues() {
        const { exchange, queues } = rabbitMQConfig;
        const channel = await this.rabbitMQService.getChannel();

        await channel.assertExchange(exchange, 'topic', { durable: true });

        for (const { queueName, routingKeys } of queues) {
            if (routingKeys && Array.isArray(routingKeys)) {
                for (const routingKey of routingKeys) {
                    if (typeof routingKey === 'string') {
                        await channel.assertQueue(queueName, { durable: true });

                        await channel.bindQueue(queueName, exchange, routingKey);

                        this.rabbitMQConsumer.startListening(queueName, routingKey);
                    } else {
                        logger.log(
                            LoggerLevel.ERROR,
                            loggerMessage({
                                message: `Routing key is undefined or not a string for queue: ${queueName}`,
                            }),
                        );
                    }
                }
            }
            logger.log(LoggerLevel.INFO, loggerMessage({ message: `[*] Waiting for messages in ${queueName}` }));
        }
    }
}
