import { Router } from "express";

import {
  getMediaListHandler,
  getMediaHandler,
  searchMediaHandler,  
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
router.post('/:id/favorite', ); 
router.delete('/:id/favorite', ); 
router.post('/:id/review', ); 
router.delete('/:id/review', ); 

router.use(restrictTo('admin')); 
router.post('/blacklist', ); 
router.delete('/blacklist', ); 

export default router;
