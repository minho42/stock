import dotenv from 'dotenv'
dotenv.config();
import path from "path"
import cookieParser from "cookie-parser"
import express, {Request, Response, NextFunction} from "express"
import "./db/mongoose"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import {router as userRoutes} from "./routes/userRoutes"
import {router as journalRoutes} from "./routes/journalRoutes"
import {router as yahooDataRoutes} from "./routes/yahooDataRoutes"
import {router as ownedStockRoutes} from "./routes/ownedStockRoutes"

export const app = express();

// app.use(function (req: Request, res: Response, next:Nextfunction) {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self' *.investingjournals.com; connect-src 'self' *.investingjournals.com; style-src-elem 'self' *.fonts.googleapis.com; "
//   );
//   next();
// });

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use(userRoutes);
app.use(journalRoutes);
app.use(yahooDataRoutes);
app.use(ownedStockRoutes);

app.get("", (req: Request, res: Response) => {
  res.send({
    data: "It's working!",
  });
});

// app.get("*", (req: Request, res: Response) => {
//   res.status(404).send({
//     error: "404 Not Found",
//   });
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}
