'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CurrentBusiness extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.CurrentBusiness.hasMany(models.User, {
        as: 'members'
      });

      models.CurrentBusiness.hasMany(models.Skillpool, {
        as: 'skillpool'
      });
    }
  };
  CurrentBusiness.init({
    current_business_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CurrentBusiness',
  });
  return CurrentBusiness;
};