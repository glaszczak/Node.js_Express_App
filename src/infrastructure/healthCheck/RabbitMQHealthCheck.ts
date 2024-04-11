import { RabbitMqService } from 'infrastructure/messaging/RabbitMqService';
import { Inject, Service } from 'typedi';

import { IHealthCheck } from './IHealthCheck';

@Service()
export class RabbitMqHealthCheck implements IHealthCheck {
    constructor(@Inject(() => RabbitMqService) private rabbitMqService: RabbitMqService) {}

    async check(): Promise<{ isHealthy: boolean; details?: string }> {
        if (this.rabbitMqService.isConnected()) {
            return { isHealthy: true };
        } else {
            return {
                isHealthy: false,
                details: 'Unable to connect to RabbitMQ',
            };
        }
    }
}
