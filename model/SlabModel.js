import dbConfig from "../config.js";

const Model = dbConfig.Model;
const sequelize = dbConfig.Sequelize;
const DataTypes = dbConfig.DataTypes;

class SlabModel extends Model {}

SlabModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rate: {
      type: DataTypes.FLOAT,
      isDecimal: true,
    },
    slabText: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "slab",
    freezeTableName: true,
  }
);

export default SlabModel;
