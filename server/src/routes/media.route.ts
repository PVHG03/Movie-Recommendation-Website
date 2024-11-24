import { Router } from "express";

import {
  getMediaListHandler,
  getMediaHandler,
  searchMediaHandler,
  favoriteMediaHandler,
  unfavoriteMediaHandler,
  reviewMediaHandler,
  removeReviewMediaHandler,
  editReviewMediaHandler,  
} from "../controllers/media.controller";
import authenticate from "../middlewares/authenticate";
import restrictTo from "../middlewares/restrict";

const router = Router({
  mergeParams: true,
  caseSensitive: true,
  strict: true,
});

router.get("/search", searchMediaHandler); 
router.get("/:category", getMediaListHandler); 
router.get("/detail/:mediaId", getMediaHandler); 

router.use(authenticate); 
router.post('/:mediaId/favorite', favoriteMediaHandler); 
router.delete('/:mediaId/favorite', unfavoriteMediaHandler); 
router.post('/:mediaId/review', reviewMediaHandler); 
router.put('/:mediaId/review', editReviewMediaHandler);
router.delete('/:mediaId/review', removeReviewMediaHandler); 

router.use(restrictTo('admin')); 
router.post('/blacklist', ); 
router.delete('/blacklist', ); 

export default router;
