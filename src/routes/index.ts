import { Router } from "express";
import {
  callback,
  xeroInfo,
  connect,
  getTrialBalance,
} from "../controllers/xero";

import { connectqb, callbackqb } from "../controllers/quickbook";
import { login } from "../controllers/auth";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send(`<h1 >Little newt server alive</h1>`);
});

router.post("/login", login);

router.get("/xero/connect", connect);
router.get("/xero/callback", callback);
router.get("/xero/xeroInfo", xeroInfo);
router.get("/xero/trialBalance", getTrialBalance);

router.get("/qb/connect", connectqb);
router.get("/qb/callback", callbackqb);

export default router;
