import { Router } from "express";
import { callback, xeroInfo, connect, getJournlas } from "../controllers/xero";

import { connectqb, callbackqb, QuickBookInfo } from "../controllers/quickbook";
import { login } from "../controllers/auth";

const router: Router = Router();

router.get("/", (req, res) => {
  res.send(`<h1 >Little newt server alive</h1>`);
});

router.post("/login", login);

router.get("/xero/connect", connect);
router.get("/xero/callback", callback);
router.get("/xero/xeroInfo", xeroInfo);
router.get("/xero/journals", getJournlas);

router.get("/qb/connect", connectqb);
router.get("/qb/callback", callbackqb);
router.get("/qb/info", QuickBookInfo);

export default router;
