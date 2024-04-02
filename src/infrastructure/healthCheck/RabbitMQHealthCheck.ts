import { RabbitMQService } from 'infrastructure/messaging/RabbitMQService';
import { Inject, Service } from 'typedi';

import { IHealthCheck } from './IHealthCheck';

@Service()
export class RabbitMQHealthCheck implements IHealthCheck {
    constructor(@Inject(() => RabbitMQService) private rabbitMQService: RabbitMQService) {}

    async check(): Promise<{ serviceName: string; isHealthy: boolean; details?: string }> {
        if (this.rabbitMQService.isConnected()) {
            return { serviceName: 'RabbitMQ', isHealthy: true };
        } else {
            return {
                serviceName: 'RabbitMQ',
                isHealthy: false,
                details: 'Unable to connect to RabbitMQ',
            };
        }
    }
}
