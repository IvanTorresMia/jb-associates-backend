import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { db } from "./models";
import messageRoutes from "./routes/tweetRoutes";
import userRoutes from "./routes/userRoutes";
import envRoutes from "./routes/envRoutes";
const cors = require("cors");

const app = express();

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/tweets", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/env", envRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).end();
});

// Syncing our database
db.sync({ alter: true }).then(() => {
  console.info("connected to the database!");
});

app.listen(3000);
