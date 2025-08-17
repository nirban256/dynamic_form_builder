import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(
    session({
        secret: "your-secret-key",  // use env var in production!
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // set secure: true if using HTTPS
    })
);

const corsOptions = {
    origin: process.env.FRONTEND_URL, // This will be your Vercel URL
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected"))
    .catch(err => console.error(err));

app.use("/api/auth", authRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});