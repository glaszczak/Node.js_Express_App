import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { ENV } from './env';

const mysqlConfig: MysqlConnectionOptions = {
    type: 'mysql',
    host: ENV.MYSQL.HOST,
    port: Number(ENV.MYSQL.PORT),
    username: ENV.MYSQL.USERNAME,
    password: ENV.MYSQL.PASSWORD,
    database: ENV.MYSQL.DATABASE,
    synchronize: true,
    // logging: ENV.APPLICATION.MODE === 'development',
    bigNumberStrings: false,
    connectTimeout: 10000,
    acquireTimeout: 10000,
};

export default mysqlConfig;
