export const rabbitMQConfig = {
    rabbitMQURI: process.env.RABBITMQ_URI,
    exchange: process.env.RABBITMQ_EXCHANGE || '',
    queues: [
        {
            queueName: process.env.RABBITMQ_QUEUE_1 || '',
            routingKeys: [process.env.RABBITMQ_ROUTING_KEY_1A || ''],
        },
        {
            queueName: process.env.RABBITMQ_QUEUE_2 || '',
            routingKeys: [process.env.RABBITMQ_ROUTING_KEY_2A || '', process.env.RABBITMQ_ROUTING_KEY_2B || ''],
        },
    ],
};
