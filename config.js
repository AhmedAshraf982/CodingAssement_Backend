import { Sequelize, DataTypes, Model } from "sequelize";
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBCLOUDUSER,
  process.env.DBCLOUDPASSWORD,
  {
    host: process.env.DBCLOUDHOST,
    port: process.env.DBCLOUDPORT,
    dialect: "mysql",
  }
);

const connection = {};

connection.Sequelize = sequelize;
connection.Model = Model;
connection.DataTypes = DataTypes;

export default connection;
