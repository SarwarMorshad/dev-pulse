import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendResponse(res, 500, false, error.message || "Internal server error");
};

export default globalErrorHandler;
