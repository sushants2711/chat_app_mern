import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./config/db.connect.js";
import userRouter from "./routers/user.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 7678;

connectDb();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// api end point 
app.use("/api/v1/auth", userRouter);

// server listen
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});