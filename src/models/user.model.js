'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Disease, { foreignKey: 'userId', as: 'diseases' });
      User.hasOne(models.Profile, { foreignKey: 'userId', as: 'profile' });
      User.hasMany(models.LocationHistory, { foreignKey: 'userId', as: 'locationHistory' });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      // uid: DataTypes.STRING, // firebase
      avatar: DataTypes.STRING,
      avatarKey: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true, // default
    },
  );
  return User;
};
