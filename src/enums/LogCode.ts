export const enum LoggerLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    SILLY = 'silly',
    SILENT = 'silent',
}

export const enum LogCode {
    CODE_G000 = 'CODE_G000',
    CODE_G001 = 'CODE_G001',
    CODE_G002 = 'CODE_G002',
    CODE_G003 = 'CODE_G003',
    CODE_G004 = 'CODE_G004',
    CODE_G005 = 'CODE_G005',
    CODE_G006 = 'CODE_G006',
    CODE_G007 = 'CODE_G007',
    CODE_G008 = 'CODE_G008',

    CODE_E001 = 'CODE_E001',
}

export const enum LogCodeDictionary {
    CODE_G000 = 'Common error code',
    CODE_G001 = 'Bad request',
    CODE_G002 = 'Unauthorized',
    CODE_G003 = 'Not Found',
    CODE_G004 = 'Conflict',
    CODE_G005 = 'Internal Server Error',
    CODE_G006 = 'Forbidden',
    CODE_G007 = 'Unprocessable Entity',
    CODE_G008 = 'Too Many Requests',

    CODE_E001 = 'Custom Log',
}
