import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import mediaRoutes from "./media.route";
import catchError from "../utils/catchError";
import { User, UserDocument } from "../models/user.model";
import authenticate from "../middlewares/authenticate";

const router = Router();

router.get(
  "/test",
  authenticate,
  catchError(async (req, res) => {
    const userId = req.userId;
    const userFavorite = await User.findById(userId).select("favorite");

    return res.json({ favorite: userFavorite });
  })
);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/:mediaType", mediaRoutes);

export default router;
