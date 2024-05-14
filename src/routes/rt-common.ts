import 'express-async-errors';
import { NextFunction, Request, Response, Router } from "express";
import * as commonAuthController from "../controller/ctr-common-auth";
import * as commonFootballController from "../controller/ctr-common-football";
import { getInfo } from '../services/svc-football';
import { peek } from '../redis';

const router = Router();


router.get("/football/info", async (req: Request, res: Response, next: NextFunction) => {
    const info = await getInfo();

    res.status(200).json({
        schJobs: await peek("main:sch-jobs"),
        football: info
    });
});
router.get("/football/latest-matches", commonFootballController.getLastMatches);
router.get("/football/top100", commonFootballController.getTop100Players);
router.post("/football/matchmake", commonFootballController.matchmake);
router.post("/football/matchsim-resolve", commonFootballController.matchSimResolve);

router.post("/auth/signup", commonAuthController.signup);
router.post("/auth/login", commonAuthController.login);





export default router;