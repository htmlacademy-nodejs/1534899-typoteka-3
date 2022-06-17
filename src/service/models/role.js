"use strict";

const {Model, DataTypes} = require(`sequelize`);

class Role extends Model {}

const defineRole = (sequelize) => Role.init({
  // id: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   allowNull: false,
  // },
  name: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  sequelize,
  timestamps: false,
  modelName: `Role`,
  tableName: `roles`,
});

module.exports = defineRole;
