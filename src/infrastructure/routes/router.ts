import { LogCode } from 'enums';
import { Request, Response, Router } from 'express';
import { MySQLHealthCheck } from 'infrastructure/healthCheck/MySQLHealthCheck';
import { RabbitMQHealthCheck } from 'infrastructure/healthCheck/RabbitMQHealthCheck';
import Container from 'typedi';

import rabbitMQRoutes from './rabbitMQRoutes';
import userRoutes from './userRoutes';

const router = Router();

import packageJson from '@root/package.json';

router.use('/user', userRoutes);
router.use('/rabbitmq', rabbitMQRoutes);

router.get('/check/ping', async (req: Request, res: Response) => {
    try {
        const mysqlHealth = await Container.get(MySQLHealthCheck).check();
        const rabbitHealth = await Container.get(RabbitMQHealthCheck).check();

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
