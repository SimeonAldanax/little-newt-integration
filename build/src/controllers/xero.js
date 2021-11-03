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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrialBalance = exports.xeroInfo = exports.callback = exports.connect = exports.authenticationData = void 0;
require("dotenv").config();
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const xero_node_1 = require("xero-node");
const client_id = process.env.CLIENT_ID || "";
const client_secret = process.env.CLIENT_SECRET || "";
const redirectUrl = process.env.REDIRECT_URI || "";
const scopes = "openid profile email accounting.settings accounting.reports.read accounting.journals.read accounting.contacts accounting.attachments accounting.transactions offline_access";
const xero = new xero_node_1.XeroClient({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(" "),
});
if (client_id === "" || client_secret === "" || redirectUrl === "") {
    throw Error("Environment Variables not all set - please check your .env file in the project root or create one!");
}
const Auth = [];
const authenticationData = (req, res) => {
    return {
        decodedIdToken: req.session.decodedIdToken,
        decodedAccessToken: req.session.decodedAccessToken,
        tokenSet: req.session.tokenSet,
        allTenants: req.session.allTenants,
        activeTenant: req.session.activeTenant,
    };
};
exports.authenticationData = authenticationData;
const connect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const consentUrl = yield xero.buildConsentUrl();
        // console.log(consentUrl);
        //res.redirect(consentUrl);
        res.send({ url: consentUrl });
    }
    catch (err) {
        console.log(err, "err");
        res.send("Sorry, something went wrong ");
    }
});
exports.connect = connect;
const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.url, "req.url");
        const tokenSet = yield xero.apiCallback(req.url);
        // console.log(tokenSet, "tokenSet");
        yield xero.updateTenants();
        const decodedIdToken = (0, jwt_decode_1.default)(tokenSet.id_token);
        const decodedAccessToken = (0, jwt_decode_1.default)(tokenSet.access_token);
        req.session.decodedIdToken = decodedIdToken;
        req.session.decodedAccessToken = decodedAccessToken;
        req.session.tokenSet = tokenSet;
        req.session.allTenants = xero.tenants;
        // XeroClient is sorting tenants behind the scenes so that most recent / active connection is at index 0
        req.session.activeTenant = xero.tenants[0];
        const authData = (0, exports.authenticationData)(req, res);
        //console.log(authData, "authData");
        Auth.push(authData);
        res.redirect(`http://localhost:3000/newBook/xero`);
    }
    catch (err) {
        console.log(err, "err");
        res.send("Sorry, something went wrong 2");
    }
});
exports.callback = callback;
const xeroInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield xero.accountingApi.getOrganisations(Auth[0].activeTenant.tenantId);
        //console.log(response.body, "body response");
        res.send(response.body);
    }
    catch (err) {
        console.log(err, "err");
        res.send("Sorry, something went wrong 2");
    }
});
exports.xeroInfo = xeroInfo;
const getTrialBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    //console.log(req.query, "dateDATE");
    const paymentsOnly = true;
    const ifModifiedSince = new Date("2020-02-06T12:17:43.202-08:00");
    const offset = 10;
    try {
        const response = yield xero.accountingApi.getJournals(Auth[0].activeTenant.tenantId, ifModifiedSince, offset, paymentsOnly);
        console.log(response.body, "AQUIII");
        res.send({ body: response.body, status: response.response.statusCode });
    }
    catch (err) {
        console.log(err, "err");
        res.send("Sorry, something went wrong 2");
    }
});
exports.getTrialBalance = getTrialBalance;
//# sourceMappingURL=xero.js.map