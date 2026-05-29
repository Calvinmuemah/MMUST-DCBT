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
  createReflection,
  getReflections,
  getReflectionById,
  editReflection,
  removeReflection,
} from "../controllers/journal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/history", getHistory);
router.get("/reports", getReports);
router.get("/reflections", getReflections);
router.post("/reflections", createReflection);
router.get("/reflections/:reflectionId", getReflectionById);
router.put("/reflections/:reflectionId", editReflection);
router.delete("/reflections/:reflectionId", removeReflection);
router.get("/", getEntries);
router.post("/", createEntry);
router.get("/:entryId", getEntryById);
router.put("/:entryId", editEntry);
router.delete("/:entryId", removeEntry);

export default router;
