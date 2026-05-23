import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import {config} from '../config/config.js'


const router = express.Router();
const FASTAPI_URL = config.FASTAPI_URL;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// POST /api/predict
router.post("/predict", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${FASTAPI_URL}/predict`, form, {
      headers: form.getHeaders(),
      timeout: 15000,
    });

    return res.json({
      success: true,
      filename: req.file.originalname,
      result: response.data,
    });
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        error: "ML service error",
        detail: err.response.data,
      });
    }
    if (err.code === "ECONNREFUSED") {
      return res
        .status(503)
        .json({ error: "ML service unavailable. Is FastAPI running?" });
    }
    next(err);
  }
});

router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/health`, {
      timeout: 5000,
    });
    res.json({ express: "ok", fastapi: response.data });
  } catch {
    res.status(503).json({ express: "ok", fastapi: "unreachable" });
  }
});

export default router;
