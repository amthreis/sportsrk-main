import { NextFunction, Router, Request } from "express";

import 'express-async-errors';
import { FootballRepo } from "../repos/repo-football";
import * as devController from "../controller/ctr-dev";
import * as userController from "../controller/ctr-user";

const router = Router();

router.get("/football/get-all", devController.getAllPlayers);

router.get("/user/get-all", devController.getAllUsers);



export default router;