import express from "express";

import RtCommon from "./routes/rt-common";
import RtUser from "./routes/rt-user";
import RtDev from "./routes/rt-dev";
import RtAdmin from "./routes/rt-admin";

import { errorHandler } from "./middlewares/error-handler";
import { UserRole } from "./entities/user";
import { mustBe } from "./middlewares/must-be";

import cors from "cors";
import { config } from "dotenv";

config();

const app = express();

// console.log(process.env.CORS_ORIGIN);
// console.log();


app.use(express.json());
app.use(cors({
    origin: JSON.parse(process.env.CORS_ORIGIN as string)
}));

app.use("/common", RtCommon);
app.use("/user", mustBe(UserRole.USER), RtUser);
app.use("/dev", mustBe(UserRole.DEV), RtDev);
app.use("/admin", mustBe(UserRole.ADMIN), RtAdmin);

app.use(errorHandler);

export default app;