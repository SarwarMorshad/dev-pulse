import type { Response } from "express";

const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any
) => {
  res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
  });
};

export default sendResponse;
