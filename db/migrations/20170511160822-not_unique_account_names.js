

module.exports = {
  up(queryInterface, Sequelize) {
      queryInterface.removeIndex('accounts', ['name']);
      queryInterface.addIndex('accounts', ['name']);
  },

  down(queryInterface, Sequelize) {
  }
};
