import { LibraryService } from 'app-name/dist/src/services/LibraryService';
import { LogCode, LoggerLevel } from 'enums';
import { UserRepository } from 'infrastructure/repositories/UserRepository';
import { Inject, Service } from 'typedi';
import { ApiError, logger, loggerMessage } from 'utils/logger';

import { User } from '../User';

@Service()
export class UserService {
    constructor(
        @Inject(() => UserRepository)
        private userRepository: UserRepository,
        @Inject(() => LibraryService)
        private libraryService: LibraryService,
    ) {}

    async getAllUsers(): Promise<User[]> {
        try {
            return this.userRepository.getAllUsers();
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'Failed to get users',
                    error,
                }),
            );

            throw new ApiError({
                statusCode: 422,
                response: {
                    code: LogCode.CODE_G007,
                },
            });
        }
    }

    async getUserById(userId: number): Promise<User | null> {
        try {
            const user = await this.userRepository.getUserById(userId);

            if (user.length === 0) {
                logger.log(
                    LoggerLevel.WARN,
                    loggerMessage({
                        message: `User with ID ${userId} not found.`,
                    }),
                );
            }

            return user[0];
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'Failed to get user',
                    error: error,
                }),
            );

            throw new ApiError({
                statusCode: 422,
                response: {
                    code: LogCode.CODE_G007,
                },
            });
        }
    }

    async createUser(userData: User): Promise<void> {
        try {
            await this.userRepository.createUser(userData);
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'Failed to create user',
                    error,
                }),
            );

            throw new ApiError({
                statusCode: 422,
                response: {
                    code: LogCode.CODE_G007,
                },
            });
        }
    }

    async testLibrary(): Promise<void> {
        try {
            await this.libraryService.logFromLibrary('witaj!');
        } catch (error) {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'UserService.testLibrary failed',
                    error,
                }),
            );

            throw new ApiError({
                statusCode: 422,
                response: {
                    code: LogCode.CODE_G007,
                },
            });
        }
    }
}
