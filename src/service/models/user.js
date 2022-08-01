"use strict";

const {DataTypes, Model} = require(`sequelize`);
const {STRING_LENGTH} = require(`../constants`);

class User extends Model {}

const defineUser = (sequelize) => User.init({
  firstName: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(STRING_LENGTH),
    allowNull: false,
  },
  lastName: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(STRING_LENGTH),
    allowNull: false,
  },

  email: {
    // eslint-disable-next-line new-cap
    type: DataTypes. STRING(STRING_LENGTH),
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    // eslint-disable-next-line new-cap
    type: DataTypes. STRING(STRING_LENGTH),
    allowNull: false,
  },
  avatar: {
    // eslint-disable-next-line new-cap
    type: DataTypes. STRING(50),
    allowNull: false,
  },

}, {
  sequelize,
  timestamps: true,
  paranoid: true,
  modelName: `User`,
  tableName: `users`,
});

module.exports = defineUser;
