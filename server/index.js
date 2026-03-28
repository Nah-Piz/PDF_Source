import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import route from "./routes/route.js";
import connectDB from "./utils/db.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

connectDB()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));

app.use("/files", express.static("uploads"));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "app", "dist", "index.html")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "app", "dist", "index.html"));
});

app.use("/api", route);

app.listen(PORT);