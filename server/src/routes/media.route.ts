import { Router } from "express";

import {
  getMediaListHandler,
  getMediaHandler,
  searchMediaHandler,  
} from "../controllers/media.controller";
import authenticate from "../middlewares/authenticate";
import restrictTo from "../middlewares/restrict";

const router = Router({mergeParams: true});

router.get("/", getMediaListHandler); // get all medias
router.get("/:id", getMediaHandler); // get media by id
router.get("/search", searchMediaHandler); // search media by title

router.use(authenticate); // protect all routes after this middleware
router.post('/:id/favorite', ); // add media to favorite
router.delete('/:id/favorite', ); // remove media from favorite
router.post('/:id/review', ); // add review to media
router.delete('/:id/review', ); // remove review from media

router.use(restrictTo('admin')); // protect all routes after this middleware
router.post('/blacklist', ); // blacklist media
router.delete('/blacklist', ); // unblacklist media

export default router;
