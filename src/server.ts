import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

try {
  createConnection();
  console.log("DB connected");
} catch (error) {
  console.log(error);
}

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`app running on port ${port}`);
});
