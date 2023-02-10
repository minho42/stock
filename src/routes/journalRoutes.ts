import express from "express"
import { auth, authAdmin } from "../middleware/authMiddleware"
export const router = express.Router();

import {
  createJournal,
  getJournals,
  getJournalsForUser,
  getJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController"

router.post("/journals", auth, createJournal);
router.get("/journals", auth, getJournals);
router.get("/journals/user/:userId", authAdmin, getJournalsForUser);
router.get("/journals/:id", auth, getJournal);

router.patch("/journals/:id", auth, updateJournal);

router.delete("/journals/:id", auth, deleteJournal);
