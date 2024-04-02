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
    CODE_E002 = 'CODE_E002',
    CODE_E003 = 'CODE_E003',
    CODE_E004 = 'CODE_E004',
    CODE_E005 = 'CODE_E005',
    CODE_E006 = 'CODE_E006',
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

    CODE_E001 = 'No handler registered',
    CODE_E002 = 'Handler does not have a handle method',
    CODE_E003 = 'Failed to execute handler for token',
    CODE_E004 = 'Error fetching users',
    CODE_E005 = 'Error fetching user by ID',
    CODE_E006 = 'Error creating user',
}

export const enum MySQLCode {
    ER_DUP_ENTRY = 'ER_DUP_ENTRY',
}
