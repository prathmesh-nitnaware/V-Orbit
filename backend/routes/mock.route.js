import express from "express";
import { startInterview } from "../services/mockInterview.service.js";

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const result = await startInterview(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mock interview failed" });
  }
});

export default router;
