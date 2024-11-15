import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";

const restrictTo = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId);
    appAssert(user, 401, "User not found");

    const isAllowed = allowedRoles.includes(user.role);
    appAssert(
      isAllowed,
      UNAUTHORIZED,
      "You do not have permission to perform this action"
    );

    next();
  };
};

export default restrictTo;
