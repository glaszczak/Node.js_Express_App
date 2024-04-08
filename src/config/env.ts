import { z } from 'zod';

const toBoolean = (val: unknown): boolean => {
    if (typeof val === 'string') {
        return val === 'true';
    }
    return false;
};

const envSchema = z.object({
    NODE: z.object({
        ENVIRONMENT: z.string().default('development'),
    }),
    APPLICATION: z.object({
        HOST: z.string().default('0.0.0.0'),
        PORT: z.number().default(3000),
        NAME: z.string(),
    }),
    JWT: z.object({
        ACCESS_TOKEN_SECRET: z.string(),
    }),
    MYSQL: z.object({
        HOST: z.string().default('0.0.0.0'),
        PORT: z.number().default(3307),
        DATABASE: z.string(),
        USERNAME: z.string(),
        PASSWORD: z.string(),
    }),
    RABBITMQ: z.object({
        HOST: z.string(),
        PORT: z.number().default(5672),
        USERNAME: z.string(),
        PASSWORD: z.string(),
        VHOST: z.string(),
        URI: z.string(),
        EXCHANGE: z.string(),
        QUEUES: z.array(
            z.object({
                NAME: z.string(),
                ROUTING_KEYS: z.record(z.string()),
            }),
        ),
    }),
    WINSTON: z.object({
        CONSOLE_ENABLED: z.preprocess(toBoolean, z.boolean()),
        TRANSPORT_FILE_PATH: z.string(),
        TRANSPORT_SENTRY_DSN: z.string(),
    }),
});

export const ENV = envSchema.parse({
    NODE: {
        ENVIRONMENT: process.env.NODE_ENV,
    },
    APPLICATION: {
        HOST: process.env.APPLICATION_HOST,
        PORT: process.env.APPLICATION_PORT ? parseInt(process.env.APPLICATION_PORT, 10) : undefined,
        NAME: process.env.APPLICATION_NAME,
    },
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    },
    MYSQL: {
        HOST: process.env.MYSQL_CONNECTION_HOST,
        PORT: process.env.MYSQL_CONNECTION_PORT ? parseInt(process.env.MYSQL_CONNECTION_PORT, 10) : undefined,
        DATABASE: process.env.MYSQL_CONNECTION_DATABASE,
        USERNAME: process.env.MYSQL_CONNECTION_USERNAME,
        PASSWORD: process.env.MYSQL_CONNECTION_PASSWORD,
    },
    RABBITMQ: {
        HOST: process.env.RABBITMQ_HOST,
        PORT: process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT, 10) : undefined,
        USERNAME: process.env.RABBITMQ_USERNAME,
        PASSWORD: process.env.RABBITMQ_PASSWORD,
        VHOST: process.env.RABBITMQ_VHOST,
        URI: process.env.RABBITMQ_URI,
        EXCHANGE: process.env.RABBITMQ_EXCHANGE,
        QUEUES: [
            {
                NAME: process.env.RABBITMQ_QUEUE_1,
                ROUTING_KEYS: {
                    routing_queue_1A: process.env.RABBITMQ_ROUTING_KEY_1A,
                },
            },
            {
                NAME: process.env.RABBITMQ_QUEUE_2,
                ROUTING_KEYS: {
                    routing_queue_2A: process.env.RABBITMQ_ROUTING_KEY_2A,
                    routing_queue_2B: process.env.RABBITMQ_ROUTING_KEY_2B,
                },
            },
        ],
    },
    WINSTON: {
        CONSOLE_ENABLED: process.env.WINSTON_CONSOLE_ENABLED,
        TRANSPORT_FILE_PATH: process.env.WINSTON_TRANSPORT_FILE_PATH,
        TRANSPORT_SENTRY_DSN: process.env.WINSTON_TRANSPORT_SENTRY_DSN,
    },
});
