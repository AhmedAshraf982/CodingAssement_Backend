import express from "express";
import {
  calculateSlab,
  getAllSlab,
  bulkInsert,
  getMonthRate,
  yearlyGraph,
  getAllCalculation,
  setUserIds,
} from "../Controller/slabController.js";

import { protect } from "../controller/authController.js";

const router = express.Router();

router.get("/create", bulkInsert);

// Protect middleware
router.use(protect);

// Set Current User Id
router.use(setUserIds);

router.get("/get", getAllSlab);

router.post("/calculate", calculateSlab);

router.get("/calculations", getMonthRate);

router.get("/graph", yearlyGraph);

router.get("/details", getAllCalculation);

export default router;
