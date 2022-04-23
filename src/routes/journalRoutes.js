const express = require("express");
const { auth, authAdmin } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createJournal,
  getJournals,
  getJournalsForUser,
  getJournal,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");

router.post("/journals", auth, createJournal);
router.get("/journals", auth, getJournals);
router.get("/journals/user/:userId", authAdmin, getJournalsForUser);
router.get("/journals/:id", auth, getJournal);

router.patch("/journals/:id", auth, updateJournal);

router.delete("/journals/:id", auth, deleteJournal);

module.exports = router;
