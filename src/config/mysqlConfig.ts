import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const mysqlConfig: MysqlConnectionOptions = {
    type: 'mysql',
    host: process.env.MYSQL_CONNECTION_HOST,
    port: Number(process.env.MYSQL_CONNECTION_PORT),
    username: process.env.MYSQL_CONNECTION_USERNAME,
    password: process.env.MYSQL_CONNECTION_PASSWORD,
    database: process.env.MYSQL_CONNECTION_DATABASE,
    synchronize: true,
    // logging: process.env.NODE_ENV === 'development',
    bigNumberStrings: false,
    connectTimeout: 10000,
    acquireTimeout: 10000,
};

export default mysqlConfig;
