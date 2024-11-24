import { Request, Response } from "express";

import catchError from "../utils/catchError";

export const recommendedByFavorite = catchError(
  async (req: Request, res: Response) => {
    return res.status(200).json({
      status: "success",
      data: "recommendedByFavorite",
    });
  }
);

export const recommendedByRating = catchError(
  async (req: Request, res: Response) => {
    return res.status(200).json({
      status: "success",
      data: "recommendedByRating",
    });
  }
);
