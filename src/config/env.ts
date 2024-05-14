import { z } from 'zod';

const toBoolean = (val: unknown): boolean | undefined => {
    if (typeof val === 'string') {
        const normalized = val.trim().toLowerCase();

        if (normalized === 'true') {
            return true;
        } else if (normalized === 'false') {
            return false;
        }
        return undefined;
    }
    return undefined;
};

const boolSchema = z.preprocess(toBoolean, z.union([z.boolean(), z.undefined()])).refine((val) => val !== undefined, {
    message: "Value must be explicitly set to 'true' or 'false'.",
});

const parseNumber = (input: any): number | undefined => {
    const number = parseFloat(input);

    if (isNaN(number)) return undefined;

    return number;
};

const numberSchema = z
    .preprocess(parseNumber, z.number().optional())
    .refine((val) => val !== undefined, { message: 'Must be a valid number and cannot be empty.' });

const envSchema = z.object({
    APPLICATION: z.object({
        MODE: z.string().min(1),
        HOST: z.string().min(1),
        PORT: numberSchema,
        NAME: z.string().min(1),
    }),
    FRONTEND: z.object({
        HOST: z.string().min(1),
    }),
    JWT: z.object({
        ACCESS_TOKEN_SECRET: z.string().min(1),
    }),
    MYSQL: z.object({
        HOST: z.string(),
        PORT: numberSchema,
        DATABASE: z.string().min(1),
        USERNAME: z.string().min(1),
        PASSWORD: z.string().min(1),
    }),
    RABBITMQ: z.object({
        HOST: z.string().min(1),
        PORT: numberSchema,
        USERNAME: z.string().min(1),
        PASSWORD: z.string().min(1),
        VHOST: z.string().min(1),
        URI: z.string().min(1),
        EXCHANGE: z.string().min(1),
        QUEUES: z.array(
            z.object({
                NAME: z.string().min(1),
                ROUTING_KEYS: z.record(z.string()),
            }),
        ),
    }),
    WINSTON: z.object({
        CONSOLE_ENABLED: boolSchema,
        // or simplier but without checking if variable exists
        // CONSOLE_ENABLED: z.string().transform((val) => val === 'true'),
        TRANSPORT_FILE_PATH: z.string().min(1),
        TRANSPORT_SENTRY_DSN: z.string().min(1),
    }),
});

export const ENV = envSchema.parse({
    APPLICATION: {
        IS_TRUE: process.env.IS_TRUE,
        MODE: process.env.APPLICATION_MODE,
        HOST: process.env.APPLICATION_HOST,
        PORT: process.env.APPLICATION_PORT ? parseInt(process.env.APPLICATION_PORT, 10) : undefined,
        NAME: process.env.APPLICATION_NAME,
    },
    FRONTEND: {
        HOST: process.env.FRONTEND_HOST,
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
