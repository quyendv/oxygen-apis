'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocationHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LocationHistory.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'userData',
      });
    }
  }
  LocationHistory.init(
    {
      lat: DataTypes.DOUBLE,
      long: DataTypes.DOUBLE,
      aqi: DataTypes.INTEGER,
      timestamp: DataTypes.DATE,
      epoch: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'LocationHistory',
    },
  );
  return LocationHistory;
};
