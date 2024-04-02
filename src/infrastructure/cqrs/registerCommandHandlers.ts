import { CreateUserCommandHandler } from 'application/commands/user/CreateUserCommandHandler';
import { CreateUserCommandToken } from 'config/tokenDescriptions';
import { Container } from 'typedi';

import { CommandBus } from './CommandBus';

export function registerCommandHandlers() {
    const commandBus = Container.get(CommandBus);
    commandBus.registerCommandHandler(CreateUserCommandToken, Container.get(CreateUserCommandHandler));
}
