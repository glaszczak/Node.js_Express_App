import { Channel } from 'amqplib';
import { LoggerLevel } from 'enums';
import { Inject, Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

import { messageHandlers } from './handlers';
import { RabbitMqService } from './RabbitMqService';

@Service()
export class RabbitMqConsumer {
    private channel: Channel;

    @Inject(() => RabbitMqService)
    private rabbitMqService: RabbitMqService;

    public async initialize(): Promise<void> {
        if (!this.rabbitMqService.isConnected()) throw new Error('RabbitMqService is not connected.');

        this.channel = await this.rabbitMqService.getChannel();
    }

    async startListening(queueName: string, routingKey: string) {
        if (!this.channel) throw new Error('RabbitMq channel not initialized');

        this.channel.consume(
            queueName,
            (msg) => {
                if (msg) {
                    const msgContent = JSON.parse(msg.content.toString());

                    const handler = messageHandlers[routingKey];

                    if (typeof handler === 'function') {
                        // TODO: implement method to handle received message
                        logger.log(
                            LoggerLevel.INFO,
                            loggerMessage({
                                message: `[x] Received message on '${routingKey}': '${JSON.stringify(msgContent)}' from queue '${queueName}'`,
                            }),
                        );
                        handler(msgContent);
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
