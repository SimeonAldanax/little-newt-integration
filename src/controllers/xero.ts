require("dotenv").config();
import axios from "axios";
import { Request, Response } from "express";
import jwtDecode from "jwt-decode";
import { TokenSet } from "openid-client";
import { XeroAccessToken, XeroIdToken, XeroClient } from "xero-node";

declare module "express-session" {
  interface Session {
    decodedAccessToken: XeroAccessToken;
    decodedIdToken: XeroIdToken;
    tokenSet: TokenSet;
    allTenants: any[];
    activeTenant: any;
  }
}

// const client_id: string = process.env.CLIENT_ID || "";
// const client_secret: string = process.env.CLIENT_SECRET || "";
// const redirectUrl: string = process.env.REDIRECT_URI || "";

const client_id = "2C078C64D06B414AB6E76CF7FA78DB17";
const client_secret = "kJ_vxDX7cjjPD09FR4nSaAKwIQwoZTUDRhEgVBGuqzeL65_5";
const redirectUrl = "http://localhost:5000/xero/callback";
const redirectURL = "https://littlenewtback.herokuapp.com/xero/callback";

const scopes: string =
  "openid profile email accounting.settings accounting.reports.read accounting.journals.read accounting.contacts accounting.attachments accounting.transactions offline_access";

const xero = new XeroClient({
  clientId: client_id.toString(),
  clientSecret: client_secret.toString(),
  redirectUris: [redirectURL.toString(), redirectUrl.toString()],
  scopes: "openid profile email accounting.transactions offline_access".split(
    " "
  ),
  state: "123",
  httpTimeout: 3000, // ms (optional)
});

const Auth: any[] = [];

export const authenticationData: any = (req: Request, res: Response) => {
  return {
    decodedIdToken: req.session.decodedIdToken,
    decodedAccessToken: req.session.decodedAccessToken,
    tokenSet: req.session.tokenSet,
    allTenants: req.session.allTenants,
    activeTenant: req.session.activeTenant,
  };
};

export const connect = async (req: Request, res: Response) => {
  try {
    const consentUrl: string = await xero.buildConsentUrl();
    res.send({ url: consentUrl });
    // res.send({
    //   url: `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectUrl}&scope=openid profile email accounting.transactions&state=123`,
    // });
  } catch (err) {
    res.send("Sorry, something went wrong");
  }
};

export const callback = async (req: Request, res: Response) => {
  try {
    const tokenSet: TokenSet = await xero.apiCallback(req.url);
    console.log(req.url, "req.url");

    await xero.updateTenants();

    console.log("updateTenants");

    const decodedIdToken: XeroIdToken = jwtDecode(tokenSet.id_token!);
    const decodedAccessToken: XeroAccessToken = jwtDecode(
      tokenSet.access_token!
    );
    req.session.decodedIdToken = decodedIdToken;
    req.session.decodedAccessToken = decodedAccessToken;
    req.session.tokenSet = tokenSet;
    req.session.allTenants = xero.tenants;
    // XeroClient is sorting tenants behind the scenes so that most recent / active connection is at index 0
    req.session.activeTenant = xero.tenants[0];

    const authData: any = authenticationData(req, res);
    Auth.push(authData);

    //res.redirect(`http://localhost:3000/newBook/xero`);
    res.redirect(
      `https://condescending-dijkstra-2075e8.netlify.app/newBook/xero`
    );
  } catch (err) {
    console.log("desde aqui");
    console.log(err, "err");
    console.error(err);
    res.send("Sorry, something went wrong !!");
  }
};

export const xeroInfo = async (req: Request, res: Response) => {
  try {
    const response: any = await xero.accountingApi.getOrganisations(
      Auth[0].activeTenant.tenantId
    );
    //console.log(response.body, "body response");
    res.send(response.body);
  } catch (err) {
    console.log(err, "err");
    res.send("Sorry, something went wrong 2");
  }
};

export const getJournlas = async (req: Request, res: Response) => {
  const { date } = req.query;
  //console.log(req.query, "dateDATE");
  const paymentsOnly = true;

  const ifModifiedSince: Date = new Date("2020-02-06T12:17:43.202-08:00");
  const offset = 10;

  try {
    const response = await xero.accountingApi.getJournals(
      Auth[0].activeTenant.tenantId,
      ifModifiedSince,
      offset,
      paymentsOnly
    );
    console.log(response.body, "AQUIII");
    res.send({ body: response.body, status: response.response.statusCode });
  } catch (err) {
    console.log(err, "err");
    res.send("Sorry, something went wrong 2");
  }
};
