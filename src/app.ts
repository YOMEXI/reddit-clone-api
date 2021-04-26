import morgan from "morgan";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRoute";
import postRouter from "./routes/postRoute";
import subRouter from "./routes/subRoute";
import miscRouter from "./routes/miscRoute";
import commentRouter from "./routes/commentRoute";
import { errorhandler } from "./middleware/errorHandler";

//
import trim from "./middleware/trim";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

//routes

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/sub", subRouter);
app.use("/api/misc", miscRouter);
app.use("/api/comment", commentRouter);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  throw new Error(`The url ${req.originalUrl} doesnt exist`);
  next();
});

app.use(errorhandler);

export default app;
