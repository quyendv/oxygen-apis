'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ward.belongsTo(models.District, {
        foreignKey: 'district_code',
        targetKey: 'code',
        as: 'districtData',
      });
    }
  }
  Ward.init(
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
      modelName: 'Ward',
    },
  );
  return Ward;
};
