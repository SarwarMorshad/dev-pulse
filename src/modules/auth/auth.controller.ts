import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

// POST /api/auth/signup
const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/login
const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  signup,
  login,
};
