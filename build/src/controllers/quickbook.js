"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickBookInfo = exports.callbackqb = exports.connectqb = void 0;
require("dotenv").config();
const OAuthClient = require("intuit-oauth");
const client_id = process.env.CLIENT_ID_QB || "";
const client_secret = process.env.CLIENT_SECRET_QB || "";
const redirectUrl = process.env.REDIRECT_URI_QB || "";
const oauthClient = new OAuthClient({
    clientId: client_id,
    clientSecret: client_secret,
    environment: "sandbox",
    redirectUri: redirectUrl,
});
let oauth2_token_json = null;
const connectqb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUri = oauthClient.authorizeUri({
            scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
            state: "testState",
        });
        console.log("authUri", authUri);
        res.send({ url: authUri });
    }
    catch (err) {
        console.log(err, "err");
        res.send("Sorry, something went wrong ");
    }
});
exports.connectqb = connectqb;
const callbackqb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield oauthClient.createToken(req.url);
        console.log(response, "res");
        oauth2_token_json = JSON.stringify(response.getJson(), null, 2);
        res.redirect(`http://localhost:3000/newBook/quickbook`);
    }
    catch (err) {
        console.log(err, "err");
        res.send("Sorry, something went wrong 2");
    }
});
exports.callbackqb = callbackqb;
const QuickBookInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyID = oauthClient.getToken().realmId;
        const url = oauthClient.environment == "sandbox"
            ? OAuthClient.environment.sandbox
            : OAuthClient.environment.production;
        const authResponse = yield oauthClient.makeApiCall({
            url: `${url}v3/company/${companyID}/companyinfo/${companyID}`,
        });
        console.log(`The response for API call is :${JSON.stringify(authResponse)}`);
        res.send(JSON.parse(authResponse.text()));
    }
    catch (err) {
        console.log(err, "err");
        res.send("Sorry, something went wrong 2");
    }
});
exports.QuickBookInfo = QuickBookInfo;
//# sourceMappingURL=quickbook.js.map