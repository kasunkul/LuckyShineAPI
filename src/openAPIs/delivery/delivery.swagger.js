const delivery = {
  tags: ['Delivery'],
  description: 'Returns all pets from the system that the user has access to',
  operationId: 'customer',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    200: {
      description: 'A list of pets.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              pet_name: {
                type: 'string',
                description: 'Pet Name',
              },
              pet_age: {
                type: 'string',
                description: 'Pet Age',
              },
            },
          },
        },
      },
    },
  },
};

const print = {
  tags: ['Delivery'],
  description: 'Returns all pets from the system that the user has access to',
  operationId: 'customer',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    200: {
      description: 'A list of pets.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              pet_name: {
                type: 'string',
                description: 'Pet Name',
              },
              pet_age: {
                type: 'string',
                description: 'Pet Age',
              },
            },
          },
        },
      },
    },
  },
};

const deliveryList = {
  tags: ['Delivery'],
  description: 'Returns all pets from the system that the user has access to',
  operationId: 'customer',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    200: {
      description: 'A list of pets.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              pet_name: {
                type: 'string',
                description: 'Pet Name',
              },
              pet_age: {
                type: 'string',
                description: 'Pet Age',
              },
            },
          },
        },
      },
    },
  },
};

module.exports = { delivery, print, deliveryList };
