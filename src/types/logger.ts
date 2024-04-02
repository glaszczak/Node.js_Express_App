import { Logger as LoggerWinston } from 'winston';

export declare module Logger {
    export interface Log extends LoggerWinston {
        expressStream?: {
            write: (message: string) => void;
        };
    }

    export interface LoggerMessage {
        name?: string;
        message?: string;
        statusCode?: number; // Response status
        additionalData?: object | string; // Object with any additional data that cen help identify problem
        error?: any; // Error object or message
        errorCode?: string;
    }

    export interface FormLogger extends LoggerMessage {
        response?: object;
        message?: string;
    }
}
