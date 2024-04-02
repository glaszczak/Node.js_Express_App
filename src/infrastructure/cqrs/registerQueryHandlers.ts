import { GetAllUsersQueryHandler } from 'application/queries/user/GetAllUsersQueryHandler';
import { GetUserByIdQueryHandler } from 'application/queries/user/GetUserByIdQueryHandler';
import { GetAllUsersQueryToken, GetUserByIdQueryToken } from 'config/tokenDescriptions';
import { Container } from 'typedi';

import { QueryBus } from './QueryBus';

export function registerQueryHandlers() {
    const queryBus = Container.get(QueryBus);
    queryBus.registerQueryHandler(GetAllUsersQueryToken, Container.get(GetAllUsersQueryHandler));
    queryBus.registerQueryHandler(GetUserByIdQueryToken, Container.get(GetUserByIdQueryHandler));
}
