import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { airTableConfig } from "../config/airtable.js";
import { generate, generateState } from "../utils/airtableHelpers.js";
import dotenv from "dotenv";

dotenv.config();

const login = async (req, res) => {
    const { code_verifier, code_challenge } = generate();
    req.session.code_verifier = code_verifier;

    const state = generateState();
    req.session.oauthState = state;

    const params = new URLSearchParams({
        client_id: airTableConfig.clientId,
        redirect_uri: airTableConfig.redirectUri,
        response_type: "code",
        scope: "data.records:read data.records:write schema.bases:read",
        state,
        code_challenge,
        code_challenge_method: "S256"
    });

    const authUrl = `${airTableConfig.authUrl}?${params.toString()}`;

    res.redirect(authUrl);
}

const callback = async (req, res) => {
    const { code, state } = req.query;
    if (!state || state !== req.session.oauthState) {
        return res.status(400).json({ error: "Invalid state parameter" });
    }

    if (!code) {
        return res.status(400).json({ error: "Missing code" });
    }

    const code_verifier = req.session.code_verifier;
    if (!code_verifier) {
        return res.status(400).json({ error: "Missing code verifier" });
    }

    try {
        // Exchange code for access token
        const response = await axios.post(
            airTableConfig.tokenUrl,
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: airTableConfig.redirectUri,
                code_verifier: code_verifier
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                auth: {
                    username: airTableConfig.clientId,
                    password: airTableConfig.clientSecret
                }
            }
        );

        const { access_token, refresh_token, token_type } = response.data;

        // Fetch Airtable user profile
        const profileRes = await axios.get("https://api.airtable.com/v0/meta/whoami", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const profile = profileRes.data;

        // Save user in DB
        let user = await User.findOneAndUpdate(
            { airTableId: profile.id },
            {
                name: profile.email,
                airTableId: profile.id,
                accessToken: access_token,
                refreshToken: refresh_token,
            },
            { new: true, upsert: true }
        );

        // Issue JWT for session
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // redirect to frontend
        const frontendUrl = process.env.FRONTEND_URL;
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "OAuth failed" });
    }
}

export { login, callback };