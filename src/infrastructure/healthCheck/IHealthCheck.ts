export interface IHealthCheck {
    check(): Promise<{ isHealthy: boolean; details?: string }>;
}
