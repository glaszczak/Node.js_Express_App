import 'reflect-metadata';

import mysqlConfig from 'config/mysqlConfig';
import { LoggerLevel } from 'enums';
import Container from 'typedi';
import { DataSource } from 'typeorm';
import { logger, loggerMessage } from 'utils/logger';

export const AppDataSource = new DataSource(mysqlConfig);

AppDataSource.initialize()
    .then(() => {
        logger.log(
            LoggerLevel.INFO,
            loggerMessage({
                message: 'The MySQL is connected',
            }),
        );
        Container.set(DataSource, AppDataSource);
    })
    .catch((error) => {
        logger.log(
            LoggerLevel.ERROR,
            loggerMessage({
                name: 'MYSQL',
                message: 'The MySQL connection is not established',
                error,
            }),
        );
    });
