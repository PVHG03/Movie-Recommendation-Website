import { Router } from "express";

import {
  getMediaListHandler,
  getMediaHandler,
  searchMediaHandler,
  favoriteMediaHandler,
  unFavoriteMediaHandler,  
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
router.delete('/:mediaId/favorite', unFavoriteMediaHandler); 
router.post('/:mediaId/review', ); 
router.put('/:mediaId/review', );
router.delete('/:mediaId/review', ); 

router.use(restrictTo('admin')); 
router.post('/blacklist', ); 
router.delete('/blacklist', ); 

export default router;
