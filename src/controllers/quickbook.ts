require("dotenv").config();
import { Request, Response } from "express";
const OAuthClient = require("intuit-oauth");

const client_id: string = process.env.CLIENT_ID_QB || "";
const client_secret: string = process.env.CLIENT_SECRET_QB || "";
const redirectUrl: string = process.env.REDIRECT_URI_QB || "";

const oauthClient = new OAuthClient({
  clientId: client_id,
  clientSecret: client_secret,
  environment: "sandbox",
  redirectUri: redirectUrl,
});
let oauth2_token_json = null;

export const connectqb = async (req: Request, res: Response) => {
  try {
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
      state: "testState",
    });
    console.log("authUri", authUri);
    res.send({ url: authUri });
  } catch (err) {
    console.log(err, "err");
    res.send("Sorry, something went wrong ");
  }
};

export const callbackqb = async (req: Request, res: Response) => {
  try {
    const response = await oauthClient.createToken(req.url);
    console.log(response, "res");
    oauth2_token_json = JSON.stringify(response.getJson(), null, 2);
    res.redirect(`http://localhost:3000/newBook/quickbook`);
  } catch (err) {
    console.log(err, "err");
    res.send("Sorry, something went wrong 2");
  }
};

export const QuickBookInfo = async (req: Request, res: Response) => {
  try {
    const companyID = oauthClient.getToken().realmId;
    const url =
      oauthClient.environment == "sandbox"
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production;

    const authResponse = await oauthClient.makeApiCall({
      url: `${url}v3/company/${companyID}/companyinfo/${companyID}`,
    });

    console.log(
      `The response for API call is :${JSON.stringify(authResponse)}`
    );
    res.send(JSON.parse(authResponse.text()));

  } catch (err) {
    console.log(err, "err");
    res.send("Sorry, something went wrong 2");
  }
};
