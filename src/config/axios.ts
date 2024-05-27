import axios from 'axios';
import { LoggerLevel } from 'enums';
import { logger, loggerMessage } from 'utils/logger';

export function setupAxiosInterceptors() {
    axios.interceptors.request.use(
        (request) => {
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'Sending Request',
                    additionalData: {
                        url: request.url,
                        method: request.method,
                        data: request.data,
                        headers: request.headers,
                    },
                }),
            );

            return request;
        },
        (error) => {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'Request error:',
                    error,
                }),
            );

            return Promise.reject(error);
        },
    );

    axios.interceptors.response.use(
        (response) => {
            logger.log(
                LoggerLevel.INFO,
                loggerMessage({
                    message: 'Received Response:',
                    additionalData: {
                        url: response.config.url,
                        data: response.data,
                    },
                }),
            );

            return response;
        },
        (error) => {
            logger.log(
                LoggerLevel.ERROR,
                loggerMessage({
                    message: 'Request error:',
                    error,
                }),
            );

            return Promise.reject(error);
        },
    );
}
