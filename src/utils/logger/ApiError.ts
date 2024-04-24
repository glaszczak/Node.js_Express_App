import { LogCode } from 'enums';
import { Logger } from 'types';

export const loggerMessage = (data: Logger.LoggerMessage) => data;

export class ApiError extends Error {
    private readonly statusCode: number | undefined;

    private readonly response: object | undefined;

    private readonly additionalData: any | undefined;

    constructor(data: Logger.FormLogger) {
        super();

        this.name = data.name || this.name;
        this.message = data.message || '';
        this.statusCode = data?.statusCode || 500;

        this.additionalData = data.additionalData || undefined;

        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        Error.captureStackTrace(this);

        switch (this.statusCode) {
            case 400:
                this.response = data.response || {
                    message: 'Bad request',
                    code: LogCode.CODE_G001,
                };
                break;
            case 401:
                this.response = data.response || {
                    message: 'Unauthorized',
                    code: LogCode.CODE_G002,
                };
                break;
            case 403:
                this.response = data.response || {
                    message: 'Forbidden',
                    code: LogCode.CODE_G006,
                };
                break;
            case 404:
                this.response = data.response || {
                    message: 'Not Found',
                    code: LogCode.CODE_G003,
                };
                break;
            case 409:
                this.response = data.response || {
                    message: 'Conflict',
                    code: LogCode.CODE_G004,
                };
                break;
            default:
                this.response = data.response || {
                    message: 'Internal Server Error',
                    code: LogCode.CODE_G005,
                };
        }
    }
}
