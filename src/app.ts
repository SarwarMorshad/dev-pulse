import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import { authRoute } from "./modules/auth/auth.route.js";
import { issueRoute } from "./modules/issues/issue.route.js";

const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "DevPulse server is running",
  });
});

// routes
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

export default app;
