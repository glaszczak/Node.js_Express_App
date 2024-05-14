import { Router } from 'express';

import rabbitMqRoutes from './rabbitMQRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/rabbitmq', rabbitMqRoutes);
router.use('/user', userRoutes);

export default router;
