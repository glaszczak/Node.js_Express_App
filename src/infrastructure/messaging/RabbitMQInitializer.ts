import { ENV } from 'config/env';
import { LoggerLevel } from 'enums';
import { Inject, Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { RabbitMqConsumer } from './RabbitMqConsumer';
import { RabbitMqProducer } from './RabbitMqProducer';
import { RabbitMqService } from './RabbitMqService';

@Service()
export class RabbitMqInitializer {
    @Inject(() => RabbitMqService)
    private rabbitMqService: RabbitMqService;

    @Inject(() => RabbitMqConsumer)
    private rabbitMqConsumer: RabbitMqConsumer;

    @Inject(() => RabbitMqProducer)
    private rabbitMqProducer: RabbitMqProducer;

    @Inject('RABBITMQ_URI')
    private rabbitMqUri: string;

    async initialize() {
        if (!this.rabbitMqUri) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'RabbitMq URI not defined in environment variables.',
                }),
            );

            throw new Error('RabbitMq URI not defined in environment variables.');
        }

        try {
            await this.rabbitMqService.connect(this.rabbitMqUri);

            if (this.rabbitMqService.isConnected()) {
                await this.rabbitMqConsumer.initialize();

                await this.setupTopicExchangeAndQueues();

                await this.rabbitMqProducer.initialize();

                logger.log(
                    LoggerLevel.INFO,
                    loggerMessage({
                        message: 'RabbitMq communication initialized with topic exchange.',
                    }),
                );
            } else {
                throw new Error('Unable to initialize RabbitMq communication due to connection issues');
            }
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: `Failed to initialize RabbitMq communication: ${error}`,
                }),
            );
        }
    }

    async setupTopicExchangeAndQueues() {
        const exchange = ENV.RABBITMQ.EXCHANGE;
        const queues = ENV.RABBITMQ.QUEUES;

        const channel = await this.rabbitMqService.getChannel();

        await channel.assertExchange(exchange, 'topic', { durable: true });

        for (const { NAME: queueName, ROUTING_KEYS: routingKeysObj } of queues) {
            const routingKeys = Object.keys(routingKeysObj);

            for (const routingKey of routingKeys) {
                await channel.assertQueue(queueName, { durable: true });

                await channel.bindQueue(queueName, exchange, routingKey);

                this.rabbitMqConsumer.startListening(queueName, routingKey);
            }
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: `[*] Waiting for messages in ${queueName}`,
                }),
            );
        }
    }
}
