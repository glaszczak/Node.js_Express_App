export interface IHealthCheck {
    check(): Promise<{ serviceName: string; isHealthy: boolean; details?: string }>;
}
