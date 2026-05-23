import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

// POST /api/auth/signup
const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUserIntoDB(req.body);
    sendResponse(res, 201, true, "User registered successfully", result);
  } catch (error: any) {
    sendResponse(res, 400, false, error.message);
  }
};

// POST /api/auth/login
const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    sendResponse(res, 200, true, "Login successful", result);
  } catch (error: any) {
    sendResponse(res, 401, false, error.message);
  }
};

export const authController = {
  signup,
  login,
};
