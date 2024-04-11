import { Router } from 'express';
import { RabbitMqController } from 'infrastructure/api/express/controllers/RabbitMqController';
import { Container } from 'typedi';

const router = Router();

const rabbitMqController = Container.get(RabbitMqController);

router.post('/send-notification-to-exchange', rabbitMqController.sendNotificationToExchange.bind(rabbitMqController));
router.post('/send-notification-to-queue', rabbitMqController.sendNotificationToQueue.bind(rabbitMqController));

export default router;
