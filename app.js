import express from "express";
import userRouter from "./routes/userRoutes.js";
import slabRouter from "./routes/slabRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOption = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOption));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/slab", slabRouter);

export default app;
