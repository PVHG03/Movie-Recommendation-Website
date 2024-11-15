import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./routes/index";
import { APP_ORIGIN, PORT } from "./constants/env";
import errorHandler from "./middlewares/errorHandler";
import connectToDB from "./config/db";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(PORT, async () => {
  connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
