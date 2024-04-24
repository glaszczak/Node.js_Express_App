import { Router } from 'express';
import { UserController } from 'infrastructure/api/express/controllers/UserController';
import { Container } from 'typedi';

const router = Router({ mergeParams: true });

const userController = Container.get(UserController);

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.post('/', (req, res) => userController.createUser(req, res));
router.post('/test', (req, res) => userController.testLibrary(req, res));

export default router;
