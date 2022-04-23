const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createOrUpdateOwnedStock,
  getOwnedStocks,
  deleteOwnedStock,
} = require("../controllers/ownedStockController");

router.post("/ownedStocks", auth, createOrUpdateOwnedStock);
router.get("/ownedStocks", auth, getOwnedStocks);
router.delete("/ownedStocks/:id", auth, deleteOwnedStock);

module.exports = router;
