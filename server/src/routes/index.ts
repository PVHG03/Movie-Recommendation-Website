import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import mediaRoutes from "./media.route";
import { searchMediaHandler } from "../controllers/media.controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/:mediaType", mediaRoutes);

// router.get("/search/:mediaType", searchMediaHandler);

export default router;
