import { NextFunction, Router, Request } from "express";

import 'express-async-errors';
import * as adminController from "../controller/ctr-admin";

const router = Router();

router.post("/add-dev", adminController.addDev);
router.post("/set-sch-jobs", adminController.setSchJobs);


router.delete("/user/delete", adminController.deleteUser);

router.get("/football/queue/all", adminController.getFootballQueue);

router.put("/football/queue/state", adminController.setFootballQueueState);
router.get("/football/queue/state", adminController.getFootballQueueState);

router.post("/football/queue/sendx", adminController.sendxToQueue);
router.post("/football/queue/send-to-sim", adminController.sendTBPGamesToSim);

export default router;