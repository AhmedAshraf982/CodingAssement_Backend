import SlabModel from "../model/SlabModel.js";
import userSlabModel from "../model/userSlabModel.js";
import moment from "moment/moment.js";
import dbConfig from "../config.js";

export const setUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const calculateSlab = async (req, res) => {
  try {
    const { units, currentDate, slabId, user } = req.body;
    const selectedSlab = await SlabModel.findByPk(slabId);

    const userSlab = await userSlabModel.create({
      date: new Date(currentDate),
      total_rate: units * selectedSlab.rate,
      total_unit: units,
      slab_id: selectedSlab.id,
      user_id: user,
    });
    res.status(200).json({
      status: "success",
      data: {
        userSlab,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: err.message,
    });
  }
};

export const getMonthRate = async (req, res) => {
  try {
    const date = moment(new Date(Date.now()));
    const currMonth = date.month();
    const currYear = date.year();
    const prevMonth = date.subtract(1, "months").month();
    let prevYear = date.subtract(1, "months").year();
    if (prevMonth === 0) {
      prevYear = currYear;
    }

    const userSlab = await userSlabModel.findAll({
      where: {
        user_id: req.body.user,
      },
    });

    let prevRate;
    let currentRate;
    const currentMonthData = userSlab.find(
      (user) =>
        moment(user.date).month() === currMonth &&
        moment(user.date).year() === currYear
    );

    const prevMonthData = userSlab.find(
      (user) =>
        moment(user.date).month() === prevMonth &&
        moment(user.date).year() === prevYear
    );
    prevRate = prevMonthData?.dataValues?.total_rate;
    currentRate = currentMonthData?.dataValues?.total_rate;
    const difference = Math.round(
      ((currentRate - prevRate) / (prevRate + currentRate) / 2) * 100
    );
    res.status(200).json({
      status: "success",
      data: {
        difference,
        currentRate,
        prevRate,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: err.message,
    });
  }
};

export const yearlyGraph = async (req, res) => {
  try {
    const { year } = req.query;
    let curYear = new Date(Date.now()).getFullYear();
    if (year) {
      curYear = year;
    }

    const yearData = await userSlabModel.findAll({
      where: {
        user_id: req.body.user,
        date: dbConfig.Sequelize.where(
          dbConfig.Sequelize.fn("YEAR", dbConfig.Sequelize.col("date")),
          curYear
        ),
      },
      attributes: [
        [
          dbConfig.Sequelize.fn("MONTH", dbConfig.Sequelize.col("date")),
          "month",
        ],
        "total_rate",
        "total_unit",
        "date",
      ],
      group: [
        dbConfig.Sequelize.fn("MONTH", dbConfig.Sequelize.col("date")),
        "month",
      ],
    });

    yearData.sort((a, b) =>
      a.dataValues.month > b.dataValues.month
        ? 1
        : b.dataValues.month > a.dataValues.month
        ? -1
        : 0
    );

    const _ = yearData.map((a) => {
      var temp = Object.assign({}, a);

      temp.dataValues.month = a.dataValues.month = new Date(
        `2012-${a.dataValues.month}-25`
      ).toLocaleDateString("en-US", { month: "short" });

      return temp;
    });

    res.status(200).json({
      status: "success",
      data: {
        yearData,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: err.message,
    });
  }
};

export const getAllCalculation = async (req, res) => {
  try {
    const calculationDetail = await userSlabModel.findAll({
      where: { user_id: req.body.user },
      attributes: ["id", "date", "total_rate", "total_unit"],
      include: [
        { model: SlabModel, as: "us", attributes: ["rate", "slabText"] },
      ],
    });
    res.status(200).json({
      status: "success",
      data: {
        calculationDetail,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "error",
      msg: err.message,
    });
  }
};

export const getAllSlab = async (req, res) => {
  try {
    const slabs = await SlabModel.findAll({});
    return res.status(200).json({
      status: "success",
      data: {
        slabs,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: "Something went wrong",
    });
  }
};

export const bulkInsert = async (req, res) => {
  const newSlab = await SlabModel.bulkCreate([
    { rate: 23, slabText: "Less than and equal to 100 units" },
    {
      rate: 30,
      slabText: "Greater than 100 units and less than equal to 250 units",
    },
    {
      rate: 34,
      slabText: "Greater than 250 units and less than equal to 500 units",
    },
    { rate: 38, slabText: "Greater than 500 units" },
  ]);
  res.status(201).json({
    status: "success",
    data: {
      slabs: newSlab,
    },
  });
};
