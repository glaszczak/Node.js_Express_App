import { handleMessagesForQueue1Topic1A } from './handleMessagesForQueue1Topic1A';
import { handleMessagesForQueue2Topic2A } from './handleMessagesForQueue2Topic2A';
import { handleMessagesForQueue2Topic2B } from './handleMessagesForQueue2Topic2B';

export const messageHandlers = {
    [process.env.RABBITMQ_ROUTING_KEY_1A!]: handleMessagesForQueue1Topic1A,
    [process.env.RABBITMQ_ROUTING_KEY_2A!]: handleMessagesForQueue2Topic2A,
    [process.env.RABBITMQ_ROUTING_KEY_2B!]: handleMessagesForQueue2Topic2B,
};
