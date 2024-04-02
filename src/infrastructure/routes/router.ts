import { LogCode } from 'enums';
import { Request, Response, Router } from 'express';
import { MySQLHealthCheck } from 'infrastructure/healthCheck/MySQLHealthCheck';
import { RabbitMQHealthCheck } from 'infrastructure/healthCheck/RabbitMQHealthCheck';
import Container from 'typedi';

import rabbitMQRoutes from './rabbitMQRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/user', userRoutes);
router.use('/rabbitmq', rabbitMQRoutes);

router.get('/check/ping', async (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/health', async (req: Request, res: Response) => {
    const mysqlHealth = await Container.get(MySQLHealthCheck).check();
    const rabbitHealth = await Container.get(RabbitMQHealthCheck).check();

    res.json({
        mysql: mysqlHealth,
        rabbitMQ: rabbitHealth,
    });
});

router.get('*', (_, res) => res.status(404).json({ code: LogCode.CODE_G003 }));

export default router;
