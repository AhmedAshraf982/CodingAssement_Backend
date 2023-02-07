import { Sequelize, DataTypes, Model } from "sequelize";
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSERNAME,
  process.env.DBPASSWORD,
  {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: "mysql",
  }
);

const connection = {};

connection.Sequelize = sequelize;
connection.Model = Model;
connection.DataTypes = DataTypes;

export default connection;
