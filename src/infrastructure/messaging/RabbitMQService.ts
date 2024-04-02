import { Channel, connect, Connection } from 'amqplib';
import { LoggerLevel } from 'enums';
import { Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

@Service()
export class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    async connect(uri: string): Promise<void> {
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
                    message: `Failed to connect to RabbitMQ: ${error}`,
                }),
            );
            throw new Error(`Failed to connect to RabbitMQ: ${error}`);
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
}
