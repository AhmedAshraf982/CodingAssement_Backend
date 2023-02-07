import jwt from "jsonwebtoken";
import UserModel from "../model/userModel.js";
import { promisify } from "util";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    // 201 means created
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req, res) => {
  try {
    const newUser = await UserModel.create({
      userName: req.body.userName,
      password: req.body.password,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    return res.status(400).json({
      status: "error",
      type: err.errors[0].type,
      msg: err.errors[0].message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    // 1) Check if email and password exist

    if (!userName || !password)
      throw new Error("Please provide username and password!");
    // 2) Check if user exists && password is correct
    const user = await UserModel.findOne({ where: { userName: userName } });
    if (!user || !(await UserModel.correctPassword(password, user.password))) {
      throw new Error("Incorrect Username or password");
    }
    // 3) if everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    return res.status(400).json({
      status: "error",
      msg: err.message,
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      throw new Error("You are not logged in! Please log in to get access");
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await UserModel.findByPk(decoded.id);
    if (!currentUser) {
      throw new Error("The user belonging to this token does no longer exists");
    }
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      msg: err.message,
    });
  }
};
