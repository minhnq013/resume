const {
  LINKEDIN_API_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET
} = require("./config.js");
const express = require("express");
const app = express();
const path = require("path");
const request = require("request-promise");

let accessToken = null;

app.get("/", async (req, res) => {
  try {
    const result = await fetchLinkedInProfile(accessToken);
  } catch (e) {
    if (e.statusCode || e.statusCode === 401) {
      const userLoginPage = await authenLinkedIn();
      res.send(userLoginPage);
    } else {
      console.error(e);
    }
  }
  res.send(result);
});

app.listen(8080, () => console.log("Example app listening on port 3000!"));

async function fetchLinkedInProfile() {
  const data = await request.get("https://api.linkedin.com/v2/me", {
    auth: {
      bearer: accessToken
    }
  });
  return data;
}

async function authenLinkedIn() {
  try {
    const data = await request.get(
      "https://www.linkedin.com/oauth/v2/authorization",
      {
        qs: {
          response_type: "code",
          client_id: LINKEDIN_API_CLIENT_ID,
          redirect_uri: "http://127.0.0.1:8080",
          state: LINKEDIN_CLIENT_SECRET
        }
      }
    );
    return data;
  } catch (e) {
    console.error(e);
  }
}
