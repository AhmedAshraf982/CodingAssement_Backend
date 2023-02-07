import dbConfig from "../config.js";
import bcrypt from "bcryptjs";

import userSlabModel from "./userSlabModel.js";

const Model = dbConfig.Model;
const sequelize = dbConfig.Sequelize;
const DataTypes = dbConfig.DataTypes;

class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    freezeTableName: true,
  }
);

UserModel.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
});

UserModel.correctPassword = async (clientPassword, userPassword) => {
  return await bcrypt.compare(clientPassword, userPassword);
};

UserModel.hasMany(userSlabModel, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "usd",
});

export default UserModel;
