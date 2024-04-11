import { ENV } from 'config/env';

import { handleMessagesForQueue1Topic1A } from './handleMessagesForQueue1Topic1A';
import { handleMessagesForQueue2Topic2A } from './handleMessagesForQueue2Topic2A';
import { handleMessagesForQueue2Topic2B } from './handleMessagesForQueue2Topic2B';

export interface Message {
    subject: string;
    description: string;
}

type MessageHandler = (msgContent: Message) => void;

interface MessageHandlers {
    [key: string]: MessageHandler;
}

const routingKeyHandlers: MessageHandlers = {
    routing_queue_1A: handleMessagesForQueue1Topic1A,
    routing_queue_2A: handleMessagesForQueue2Topic2A,
    routing_queue_2B: handleMessagesForQueue2Topic2B,
};

const messageHandlers: MessageHandlers = {};

ENV.RABBITMQ.QUEUES.forEach((queue) => {
    Object.entries(queue.ROUTING_KEYS).forEach(([_, routingKeyValue]) => {
        if (routingKeyValue in routingKeyHandlers) {
            messageHandlers[routingKeyValue] = routingKeyHandlers[routingKeyValue];
        }
    });
});

export { messageHandlers };
