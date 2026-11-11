import express from "express";
import { subscribe, unsubscribe } from "../controllers/newsletter.controller.js";

const router = express.Router();

// Public newsletter endpoints
router.post("/subscribe", subscribe);
router.get("/unsubscribe", unsubscribe);
router.post("/unsubscribe", unsubscribe);

export default router;
