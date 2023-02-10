import mongoose from"mongoose"

const journalSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: false,
    },
    action: {
      type: String,
      enum: ["buy", "sell", "watch", "note"],
      required: true,
      default: false,
      trim: true,
    },
    symbol: {
      type: String,
      required: false,
      trim: true,
    },
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    price: {
      type: Number,
      required: false,
      default: 0,
    },
    units: {
      type: Number,
      required: false,
      default: 0,
    },
    date: {
      type: Date,
      required: false,
      // default: Date.now,
    },
    content: {
      type: String,
      required: false,
      trim: true,
    },
    // reference: {
    //   type: String,
    //   required: false,
    //   trim: true,
    //   default: null,
    //   unique: true,
    //   index: {
    //     partialFilterExpression: {
    //       reference: { $type: mongoose.Schema.Types.String },
    //     },
    //   },
    // },
  },
  {
    timestamps: true,
  }
);

export const Journal = mongoose.model("Journal", journalSchema);
