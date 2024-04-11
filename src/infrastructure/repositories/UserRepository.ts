import { Service } from 'typedi';

import { User } from '../../domain/user/User';
import { AppDataSource } from '../storages/database';

@Service()
export class UserRepository {
    async getAllUsers(): Promise<User[]> {
        const result = await AppDataSource.query('CALL GetAllUsers()');
        return result;
    }

    async getUserById(userId: number): Promise<User[]> {
        const result = await AppDataSource.query('CALL GetUserById(?)', [userId]);
        return result.length ? result[0] : null;
    }

    async createUser(userData: User): Promise<void> {
        await AppDataSource.query('CALL CreateUser(?, ?)', [userData.user_name, userData.email]);
    }
}
