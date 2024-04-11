import { Channel } from 'amqplib';
import { Inject, Service } from 'typedi';

import { Message } from './handlers/messageHandlers';
import { RabbitMqService } from './RabbitMqService';

@Service()
export class RabbitMqProducer {
    private channel: Channel;

    @Inject(() => RabbitMqService)
    private rabbitMqService: RabbitMqService;

    public async initialize() {
        if (!this.rabbitMqService.isConnected()) {
            throw new Error('RabbitMqService is not connected.');
        }
        this.channel = await this.rabbitMqService.getChannel();
    }

    async publishToExchange(exchange: string, routingKey: string, message: Message) {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized');

        await this.channel.assertExchange(exchange, 'topic', { durable: true });
        this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    }

    public async sendToQueue(queueName: string, message: Message): Promise<boolean> {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized');

        return this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }
}
