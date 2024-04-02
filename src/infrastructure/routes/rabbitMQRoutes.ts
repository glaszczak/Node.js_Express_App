import { Router } from 'express';
import { RabbitMQProducer } from 'infrastructure/messaging/RabbitMQProducer';
import { Container } from 'typedi';

const router = Router();

router.post('/send-notification-to-exchange', async (req, res) => {
    const exchange = process.env.RABBITMQ_EXCHANGE || '';

    const { routingKey, message } = req.body;

    try {
        const rabbitMQProducer = Container.get(RabbitMQProducer);
        await rabbitMQProducer.publishToExchange(exchange, routingKey, message);
        res.status(200).json({ message: 'Notification has been sent to the queue.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send the notification.' });
    }
});

router.post('/send-notification-to-queue', async (req, res) => {
    const { queueName, message } = req.body;

    try {
        const rabbitMQProducer = Container.get(RabbitMQProducer);
        await rabbitMQProducer.sendToQueue(queueName, message);
        res.status(200).json({ message: 'Notification has been sent to the queue.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send the notification to the queue.' });
    }
});

export default router;
