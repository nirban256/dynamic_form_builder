import express from "express";
import { login, callback } from "../controllers/authController.js";

const router = express.Router();

router.get("/airtable", login);
router.get("/callback", callback);

export default router;