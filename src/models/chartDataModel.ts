import mongoose from "mongoose"

const chartDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    timestamp: {
      type: [Number],
      default: [],
    },
    quote: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

export const ChartData = mongoose.model("ChartData", chartDataSchema);
