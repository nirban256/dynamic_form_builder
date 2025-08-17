import dotenv from "dotenv";

dotenv.config();

const airTableConfig = {
    clientId: process.env.AIRTABLE_CLIENT_ID,
    clientSecret: process.env.AIRTABLE_CLIENT_SECRET,
    redirectUri: process.env.AIRTABLE_REDIRECT_URI,
    authUrl: "https://airtable.com/oauth2/v1/authorize",
    tokenUrl: "https://airtable.com/oauth2/v1/token",
    apiBaseUrl: "https://api.airtable.com/v0",
};

export { airTableConfig };