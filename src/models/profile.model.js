'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' });
    }
  }
  Profile.init(
    {
      userId: DataTypes.INTEGER,
      sex: DataTypes.BOOLEAN,
      dateOfBirth: DataTypes.DATEONLY,
      country: DataTypes.STRING,
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,
      address: DataTypes.STRING, // home,street,...
      height: DataTypes.DOUBLE, // m
      weight: DataTypes.DOUBLE, // kg
    },
    {
      sequelize,
      modelName: 'Profile',
    },
  );
  return Profile;
};
