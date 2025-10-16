import express from "express";
import open from "open";
import { google } from "googleapis";

const CLIENT_ID =
  "487488098943-gdq2i96vk8q4m4t34ff1f696n51jb20i.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://127.0.0.1:3000/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const app = express();
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("Opening browser...");
open(url);

app.get("/oauth2callback", async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  console.log("Your refresh token:", tokens.refresh_token);
  res.send("You can close this tab now.");
  process.exit(0);
});

app.listen(3000, () => console.log("Listening on port 3000"));
