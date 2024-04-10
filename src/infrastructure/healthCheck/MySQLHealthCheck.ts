import { Service } from 'typedi';
import { DataSource } from 'typeorm';

import { IHealthCheck } from './IHealthCheck';

@Service()
export class MySQLHealthCheck implements IHealthCheck {
    constructor(private dataSource: DataSource) {}

    async check(): Promise<{ isHealthy: boolean; details?: string }> {
        try {
            await this.dataSource.query('SELECT 1');
            return { isHealthy: true };
        } catch (error: any) {
            return { isHealthy: false, details: error.message };
        }
    }
}
