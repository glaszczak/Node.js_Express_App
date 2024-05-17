import { ENV } from 'config/env';
import { LoggerLevel } from 'enums';
import { Request, Response } from 'express';
import { RabbitMqService } from 'infrastructure/messaging/RabbitMqService';
import { Inject, Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

@Service()
export class RabbitMqController {
    constructor(@Inject(() => RabbitMqService) private rabbitMqService: RabbitMqService) {}

    async sendNotificationToExchange(req: Request, res: Response): Promise<void> {
        const exchange = ENV.RABBITMQ.EXCHANGE;

        try {
            const { routingKey, message } = req.body;

            await this.rabbitMqService.publishToExchange(exchange, routingKey, message);

            res.json({ message: 'Notification has been sent to the exchange.' });
        } catch (error: any) {
            if (!error.response) {
                logger.log(
                    LoggerLevel.ERROR,
                    loggerMessage({
                        name: 'RabbitMqController.sendNotificationToExchange',
                        error,
                    }),
                );
            }

            res.status(error.statusCode || 500).json(error.response || {});
        }
    }

    async sendNotificationToQueue(req: Request, res: Response): Promise<void> {
        try {
            const { queueName, message } = req.body;

            await this.rabbitMqService.sendToQueue(queueName, message);

            res.json({ message: 'Notification has been sent to the queue.' });
        } catch (error: any) {
            if (!error.response) {
                logger.log(
                    LoggerLevel.ERROR,
                    loggerMessage({
                        name: 'RabbitMqController.sendNotificationToQueue',
                        error,
                    }),
                );
            }

            res.status(error.statusCode || 500).json(error.response || {});
        }
    }
}
