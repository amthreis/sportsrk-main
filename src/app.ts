import express, { NextFunction, Request, Response } from "express";

import RtCommon from "./routes/rt-common";
import RtUser from "./routes/rt-user";
import RtDev from "./routes/rt-dev";
import RtAdmin from "./routes/rt-admin";

import { errorHandler } from "./middlewares/error-handler";
import { UserRole } from "./entities/user";
import { mustBe } from "./middlewares/must-be";

import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"]
}));

app.use("/common", RtCommon);
app.use("/user", mustBe(UserRole.USER), RtUser);
app.use("/dev", mustBe(UserRole.DEV), RtDev);
app.use("/admin", mustBe(UserRole.ADMIN), RtAdmin);

app.use(errorHandler);

export default app;