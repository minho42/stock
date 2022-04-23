const mongoose = require("mongoose");

const ownedStockSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    symbols: {
      type: [String],
      required: true,
      default: [],
      trim: true,
    },
  },
  { timestamps: true }
);

// ownedStockSchema.index({ owner: 1, symbol: 1 }, { unique: true });

const OwnedStock = mongoose.model("OwnedStock", ownedStockSchema);

module.exports = OwnedStock;
