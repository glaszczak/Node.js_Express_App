import packageJson from '@root/package.json';
import { LogCode } from 'enums';
import { Request, Response, Router } from 'express';
import { MySQLHealthCheck } from 'infrastructure/healthCheck/MySQLHealthCheck';
import { RabbitMqHealthCheck } from 'infrastructure/healthCheck/RabbitMqHealthCheck';
import Container from 'typedi';

import rabbitMqRoutes from './rabbitMQRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/rabbitmq', rabbitMqRoutes);
router.use('/user', userRoutes);

router.get('/check/ping', async (req: Request, res: Response) => {
    try {
        const mysqlHealth = await Container.get(MySQLHealthCheck).check();
        const rabbitHealth = await Container.get(RabbitMqHealthCheck).check();

        res.status(200).json({
            mysql: mysqlHealth,
            rabbitMQ: rabbitHealth,
            v: packageJson.version,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json(error.response);
    }
});

router.get('*', (_, res) => res.status(404).json({ code: LogCode.CODE_G003 }));

export default router;
