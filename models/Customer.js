const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthly_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    approved_limit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    current_debt: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Customer;
