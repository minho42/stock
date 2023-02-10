import express from"express"
import { auth } from"../middleware/authMiddleware"

export const router = express.Router();

import {
  createOrUpdateOwnedStock,
  getOwnedStocks,
  deleteOwnedStock,
} from "../controllers/ownedStockController"

router.post("/ownedStocks", auth, createOrUpdateOwnedStock);
router.get("/ownedStocks", auth, getOwnedStocks);
router.delete("/ownedStocks/:id", auth, deleteOwnedStock);
