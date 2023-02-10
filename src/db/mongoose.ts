import mongoose from"mongoose"

const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/stock";
mongoose.connect(mongodbUri);
