import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv/config";
import { config } from "./config/config.js";
import morgan from "morgan";
import predictRoute from "./routes/predict.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", predictRoute);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "express-gateway" });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(config.PORT, () => {
  console.log(`✅ Express running on http://localhost:${config.PORT}`);
});
