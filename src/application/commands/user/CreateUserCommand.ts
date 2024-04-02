import { User } from 'domain/user/User';

export class CreateUserCommand {
    constructor(public readonly userData: User) {}
}
