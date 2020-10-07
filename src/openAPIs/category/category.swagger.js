const createCategory = {
  tags: ['Category'],
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

const getCategories = {
  tags: ['Category'],
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

const getCategoryById = {
  tags: ['Category'],
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

const updateCategory = {
  tags: ['Category'],
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

module.exports = {
  createCategory, updateCategory, getCategoryById, getCategories,
};
