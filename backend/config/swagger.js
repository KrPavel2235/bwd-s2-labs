import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Опции для swagger-jsdoc
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API для управления мероприятиями и пользователями',
            version: '1.0.0',
            description: 'Документация для API управления мероприятиями и пользователями',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Локальный сервер',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            example: 'Иван Иванов',
                        },
                        email: {
                            type: 'string',
                            example: 'ivan@example.com',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-10-01T12:00:00Z',
                        },
                    },
                },
                UserInput: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Иван Иванов',
                        },
                        email: {
                            type: 'string',
                            example: 'ivan@example.com',
                        },
                    },
                },
                Event: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        title: {
                            type: 'string',
                            example: 'Конференция',
                        },
                        description: {
                            type: 'string',
                            example: 'Ежегодная конференция разработчиков',
                        },
                        date: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-12-15T10:00:00Z',
                        },
                        place: {
                            type: 'string',
                            example: 'Москва, ул. Пушкина, д. 10',
                        },
                        userId: {
                            type: 'integer',
                            example: 1,
                        },
                    },
                },
                EventInput: {
                    type: 'object',
                    required: ['title', 'date', 'place', 'userId'],
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Конференция',
                        },
                        description: {
                            type: 'string',
                            example: 'Ежегодная конференция разработчиков',
                        },
                        date: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-12-15T10:00:00Z',
                        },
                        place: {
                            type: 'string',
                            example: 'Москва, ул. Пушкина, д. 10',
                        },
                        userId: {
                            type: 'integer',
                            example: 1,
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Убедитесь, что путь к роутерам правильный
};

const specs = swaggerJsdoc(options);

export default (app) => {
    // Подключение Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};