'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Disease extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Disease.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' });
    }
  }
  Disease.init(
    {
      userId: DataTypes.INTEGER,
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Disease',
    },
  );
  return Disease;
};
