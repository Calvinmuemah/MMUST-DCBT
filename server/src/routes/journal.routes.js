import express from "express";
import {
  createEntry,
  editEntry,
  getDashboard,
  getEntries,
  getEntryById,
  getHistory,
  getReports,
  removeEntry,
} from "../controllers/journal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/history", getHistory);
router.get("/reports", getReports);
router.get("/", getEntries);
router.post("/", createEntry);
router.get("/:entryId", getEntryById);
router.put("/:entryId", editEntry);
router.delete("/:entryId", removeEntry);

export default router;
