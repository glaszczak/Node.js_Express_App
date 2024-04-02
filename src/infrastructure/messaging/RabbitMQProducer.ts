import { Channel } from 'amqplib';
import { Service } from 'typedi';

import { RabbitMQService } from './RabbitMQService';

@Service()
export class RabbitMQProducer {
    private channel: Channel;

    constructor(private rabbitMQService: RabbitMQService) {}

    public async initialize() {
        if (!this.rabbitMQService.isConnected()) {
            throw new Error('RabbitMQService is not connected.');
        }
        this.channel = await this.rabbitMQService.getChannel();
    }

    public async sendToQueue(queueName: string, message: string): Promise<boolean> {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized');

        return this.channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true,
        });
    }

    async publishToExchange(exchange: string, routingKey: string, message: string) {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized');

        await this.channel.assertExchange(exchange, 'topic', { durable: true });
        this.channel.publish(exchange, routingKey, Buffer.from(message));
    }
}
