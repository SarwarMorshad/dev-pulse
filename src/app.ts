import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import { authRoute } from "./modules/auth/auth.route.js";
import { issueRoute } from "./modules/issues/issue.route.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

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

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// global error handler — must be last
app.use(globalErrorHandler);

export default app;
