import { Channel, connect, Connection } from 'amqplib';
import { LogCode, LoggerLevel } from 'enums';
import { Inject, Service } from 'typedi';
import { ApiError, logger, loggerMessage } from 'utils/logger';

import { Message } from './handlers/messageHandlers';
import { RabbitMqConsumer } from './RabbitMqConsumer';
import { RabbitMqProducer } from './RabbitMqProducer';

@Service()
export class RabbitMqService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    @Inject(() => RabbitMqProducer)
    private rabbitMqProducer: RabbitMqProducer;

    @Inject(() => RabbitMqConsumer)
    private rabbitMqConsumer: RabbitMqConsumer;

    async connect(uri: string): Promise<void> {
        if (this.connection) return;

        try {
            this.connection = await connect(uri);
            this.channel = await this.connection.createChannel();

            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'RabbitMQ connected',
                }),
            );
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'Failed to connect to RabbitMQ',
                    error,
                }),
            );

            throw new ApiError({
                statusCode: 500,
                response: {
                    code: LogCode.CODE_G005,
                },
            });
        }
    }

    isConnected(): boolean {
        return this.connection !== null && this.channel !== null;
    }

    async getChannel(): Promise<Channel> {
        if (!this.connection) {
            throw new Error('RabbitMQ channel has not been initialized.');
        }
        return await this.connection.createChannel();
    }

    async closeChannel(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
            this.channel = null;

            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'RabbitMQ channel closed',
                }),
            );
        }
    }

    async closeConnection(): Promise<void> {
        if (this.connection) {
            await this.closeChannel();
            await this.connection.close();
            this.connection = null;

            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'RabbitMQ connection closed',
                }),
            );
        }
    }

    public async publishToExchange(exchange: string, routingKey: string, message: Message): Promise<void> {
        await this.rabbitMqProducer.publishToExchange(exchange, routingKey, message);
    }

    public async sendToQueue(queue: string, message: Message): Promise<void> {
        await this.rabbitMqProducer.sendToQueue(queue, message);
    }
}
