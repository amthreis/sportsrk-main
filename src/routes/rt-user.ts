import { NextFunction, Router, Request } from "express";

import 'express-async-errors';
//import devController from "../controller/ctr-dev";
import * as userController from "../controller/ctr-user";

const router = Router();

router.post("/football/enroll", userController.enrollToFootball);

router.post("/football/queue/join", userController.joinQueue);
router.post("/football/queue/leave", userController.leaveQueue);

export default router;