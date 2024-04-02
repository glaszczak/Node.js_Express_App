import { UserService } from 'domain/user/services/UserService';
import { Request, Response } from 'express';
import { Router } from 'express';
import { Container } from 'typedi';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
    try {
        const userService = Container.get(UserService);
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const userService = Container.get(UserService);
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).send({ error: 'User ID must be a number' });
        }
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(error.statusCode || 500).json(error.response);
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const userService = Container.get(UserService);
        await userService.createUser(userData);

        res.status(201).send({ message: 'User created successfully' });
    } catch (error: any) {
        res.status(error.statusCode || 500).json(error.response);
    }
});

export default router;
