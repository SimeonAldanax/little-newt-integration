import { Router } from "express";
import {
  callback,
  xeroInfo,
  connect,
  getTrialBalance,
} from "../controllers/xero";

import { connectqb, callbackqb } from "../controllers/quickbook";

const router: Router = Router();

router.get("/connect", connect);
router.get("/callback", callback);
router.get("/xeroInfo", xeroInfo);
router.get("/trialBalance", getTrialBalance);

router.get("/qb/connect", connectqb);
router.get("/qb/callback", callbackqb);

export default router;
