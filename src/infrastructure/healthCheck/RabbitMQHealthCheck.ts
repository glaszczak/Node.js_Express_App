import { RabbitMQService } from 'infrastructure/messaging/RabbitMQService';
import { Inject, Service } from 'typedi';

import { IHealthCheck } from './IHealthCheck';

@Service()
export class RabbitMQHealthCheck implements IHealthCheck {
    constructor(@Inject(() => RabbitMQService) private rabbitMQService: RabbitMQService) {}

    async check(): Promise<{ isHealthy: boolean; details?: string }> {
        if (this.rabbitMQService.isConnected()) {
            return { isHealthy: true };
        } else {
            return {
                isHealthy: false,
                details: 'Unable to connect to RabbitMQ',
            };
        }
    }
}
