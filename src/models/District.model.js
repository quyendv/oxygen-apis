'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      District.belongsTo(models.City, {
        foreignKey: 'city_code',
        targetKey: 'code',
        as: 'cityData',
      });
    }
  }
  District.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      codename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      division_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      short_codename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'District',
    },
  );
  return District;
};
