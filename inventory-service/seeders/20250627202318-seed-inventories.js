'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'inventories',
      [
        {
          producto_id: 1,
          cantidad: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          producto_id: 2,
          cantidad: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          producto_id: 3,
          cantidad: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventories', null, {});
  },
};
