"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xero_1 = require("../controllers/xero");
const quickbook_1 = require("../controllers/quickbook");
const router = (0, express_1.Router)();
router.get("/connect", xero_1.connect);
router.get("/callback", xero_1.callback);
router.get("/xeroInfo", xero_1.xeroInfo);
router.get("/trialBalance", xero_1.getTrialBalance);
router.get("/qb/connect", quickbook_1.connectqb);
router.get("/qb/callback", quickbook_1.callbackqb);
exports.default = router;
//# sourceMappingURL=index.js.map