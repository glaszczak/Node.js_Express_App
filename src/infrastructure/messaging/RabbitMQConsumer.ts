import { Channel } from 'amqplib';
import { LoggerLevel } from 'enums';
import { Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { messageHandlers } from './handlers';
import { RabbitMQService } from './RabbitMQService';

@Service()
export class RabbitMQConsumer {
    private channel: Channel;

    constructor(private rabbitMQService: RabbitMQService) {}

    public async initialize(): Promise<void> {
        if (!this.rabbitMQService.isConnected()) throw new Error('RabbitMQService is not connected.');

        this.channel = await this.rabbitMQService.getChannel();
    }

    async startListening(queueName: string, routingKey: string) {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized');

        this.channel.consume(
            queueName,
            (msg) => {
                if (msg) {
                    const msgContent = msg.content.toString();
                    const handler = messageHandlers[routingKey];

                    if (typeof handler === 'function') {
                        handler(msgContent);

                        logger.log(
                            LoggerLevel.INFO,
                            loggerMessage({
                                message: `[x] Received message on '${routingKey}': '${msgContent}' from queue '${queueName}'`,
                            }),
                        );
                    } else {
                        logger.log(
                            LoggerLevel.WARN,
                            loggerMessage({
                                message: `No handler for routing key '${routingKey}' from queue '${queueName}'`,
                            }),
                        );
                    }

                    this.channel.ack(msg);
                }
            },
            { noAck: false },
        );
    }
}
