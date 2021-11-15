'use strict';

const {Model, DataTypes} = require('sequelize');


class Role extends Model {};

const defineRole = (sequelize) => Role.init({
  // eslint-disable-next-line new-cap
  name: DataTypes.STRING(255),
  allowNull: false,
}, {
  sequelize,
  modelName: `Role`,
  tableName: `roles`,
})

module.exports = defineRole;
