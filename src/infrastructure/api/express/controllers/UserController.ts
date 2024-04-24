import { UserService } from 'domain/user/services/UserService';
import { LogCode, LoggerLevel } from 'enums';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { logger, loggerMessage } from 'utils/logger';

@Service()
export class UserController {
    constructor(@Inject(() => UserService) private userService: UserService) {}

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();

            res.json(users);
        } catch (error: any) {
            res.status(error.statusCode || 500).json(error.response);

            if (!error.response) {
                logger.log(
                    LoggerLevel.ERROR,
                    loggerMessage({
                        name: 'UserController.getAllUsers',
                        error,
                    }),
                );
            }
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);

            const user = await this.userService.getUserById(userId);

            if (!user) {
                res.status(404).json({ code: LogCode.CODE_G003 });
                return;
            }

            res.json(user);
        } catch (error: any) {
            res.status(error.statusCode || 500).json(error.response);

            if (!error.response) {
                logger.log(
                    LoggerLevel.ERROR,
                    loggerMessage({
                        name: 'UserController.getUserById',
                        error,
                    }),
                );
            }
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;

            await this.userService.createUser(userData);

            res.status(201).json();
        } catch (error: any) {
            res.status(error.statusCode || 500).json(error.response);

            if (!error.response) {
                logger.log(
                    LoggerLevel.ERROR,
                    loggerMessage({
                        name: 'UserController.createUser',
                        error,
                    }),
                );
            }
        }
    }

    async testLibrary(req: Request, res: Response): Promise<void> {
        try {
            await this.userService.testLibrary();

            res.status(200).json();
        } catch (error: any) {
            res.status(error.statusCode || 500).json(error.response);

            if (!error.response) {
                logger.log(
                    LoggerLevel.ERROR,
                    loggerMessage({
                        name: 'UserController.testLibrary',
                        error,
                    }),
                );
            }
        }
    }
}
