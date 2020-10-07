const {
  customer,
  drivers,
  list,
} = require("./src/openAPIs/customer/customer.swagger");
const {
  delivery,
  print,
  deliveryList,
} = require("./src/openAPIs/delivery/delivery.swagger");
const {
  createCategory,
  updateCategory,
  getCategoryById,
  getCategories,
} = require("./src/openAPIs/category/category.swagger");
const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "APIs Document",
    description: "your description here",
    termsOfService: "",
    contact: {
      name: "Tran Son hoang",
      email: "son.hoang01@gmail.com",
      url: "https://hoangtran.co",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  paths: {
    "/customer": {
      get: customer,
    },
    "/customer/drivers": {
      get: drivers,
    },
    "/customer/list/{type}": {
      get: list,
    },
    "/delivery": {
      get: delivery,
    },
    "/delivery/print": {
      post: print,
    },
    "/delivery/list/{type}": {
      get: deliveryList,
    },
    "/category": {
      post: createCategory,
    },
    "/category": {
      get: getCategories,
    },
    "/category/{id}": {
      get: getCategoryById,
    },
    "/category/": {
      put: updateCategory,
    },
  },
};

module.exports = { swaggerDocument };
