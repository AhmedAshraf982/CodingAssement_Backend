import dbConfig from "../config.js";
import SlabModel from "./SlabModel.js";
import UserModel from "./userModel.js";

const Model = dbConfig.Model;
const sequelize = dbConfig.Sequelize;
const DataTypes = dbConfig.DataTypes;

class userSlabModel extends Model {}

userSlabModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    total_rate: {
      type: DataTypes.FLOAT,
      isDecimal: true,
    },
    total_unit: {
      type: DataTypes.FLOAT,
      isDecimal: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    slab_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "user_slab",
    freezeTableName: true,
  }
);
userSlabModel.belongsTo(SlabModel, {
  foreignKey: "slab_id",
  targetKey: "id",
  as: "us",
});
export default userSlabModel;
