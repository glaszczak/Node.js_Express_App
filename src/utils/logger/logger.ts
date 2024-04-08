import { ENV } from 'config/env';
import { LoggerLevel } from 'enums';
import { readFileSync } from 'fs';
import { TransformableInfo } from 'logform';
import { resolve } from 'path';
import { Logger } from 'types';
import { createLogger, format, transports } from 'winston';
import { ConsoleTransportInstance, FileTransportInstance, HttpTransportInstance } from 'winston/lib/winston/transports';
import SentryTransport from 'winston-transport-sentry-node/dist/transport';

const { printf, combine, timestamp } = format;
const enabledTransports: Array<ConsoleTransportInstance | FileTransportInstance | HttpTransportInstance | SentryTransport> = [];
const packageJSON = JSON.parse(readFileSync(resolve('package.json')).toString());

const customFormat = printf((data: TransformableInfo) => {
    if (data.source == 'express') {
        // That's express log format
        return `[${data.timestamp}] [${ENV.APPLICATION.NAME}] [exp] [${data.level}] ${data.message}`;
    }

    if (data.error !== null && data.error instanceof Error) {
        data.error = {
            message: data.error.message,
            stack: data.error.stack,
        };
    }

    return `[${data.timestamp}] [${ENV.APPLICATION.NAME}] [${data.level}] [${data.requestId || ''}] [${
        ENV.NODE.ENVIRONMENT === 'development' ? JSON.stringify(data, null, 4) : JSON.stringify(data)
    }]`;
});

const ignorePrivate = format((data) => {
    if (data.private) {
        return false;
    }
    return data;
});

if (ENV.WINSTON.CONSOLE_ENABLED) {
    enabledTransports.push(
        new transports.Console({
            level: LoggerLevel.INFO,
            handleExceptions: true,
        }),
    );
}

if (ENV.WINSTON.TRANSPORT_FILE_PATH) {
    enabledTransports.push(
        new transports.File({
            handleExceptions: true,
            filename: ENV.WINSTON.TRANSPORT_FILE_PATH,
        }),
    );
}

if (ENV.WINSTON.TRANSPORT_SENTRY_DSN) {
    enabledTransports.push(
        new SentryTransport({
            sentry: {
                normalizeDepth: 10,
                dsn: ENV.WINSTON.TRANSPORT_SENTRY_DSN,
                environment: ENV.NODE.ENVIRONMENT,
                release: `${packageJSON.name}@${packageJSON.version}`,
            },
            level: LoggerLevel.ERROR,
        }),
    );
}

const logger: Logger.Log = createLogger({
    format: combine(timestamp(), format.splat(), ignorePrivate(), customFormat),
    transports: enabledTransports,
    exitOnError: true,
});

logger.expressStream = {
    write: (message: string) => {
        logger.log({
            level: LoggerLevel.INFO,
            source: 'express',
            handleExceptions: true,
            message: message.substring(0, message.lastIndexOf('\n')),
        });
    },
};

export { logger };
