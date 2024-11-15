import { Response, ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((issue) => {
    path: issue.path.join(".");
    message: issue.message;
  });

  return res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(`PATH ${req.path} | METHOD ${req.method}`, error);

  if (error instanceof AppError) {
    handleAppError(res, error);
  }
  if (error instanceof z.ZodError) {
    handleZodError(res, error);
  }
  
  res.status(INTERNAL_SERVER_ERROR).send("Internal server error");

  next();
};

export default errorHandler;
