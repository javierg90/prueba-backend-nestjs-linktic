'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'products',
      [
        {
          nombre: 'Camiseta',
          precio: 50000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: 'Zapatos',
          precio: 120000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: 'Gorra',
          precio: 30000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};
