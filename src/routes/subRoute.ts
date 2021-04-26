import express from "express";

import {} from "./../controllers/post";
import { authorize, OnlyUser, UserOwnSub } from "./../controllers/auth";
import {
  createSub,
  oneSub,
  SubImage,
  popularSub,
  Search,
} from "./../controllers/sub";

const router = express.Router();

router.post("/creates", authorize, createSub);
router.post("/image/:name", authorize, UserOwnSub, SubImage);
router.get("/popular", popularSub);
router.get("/:name", OnlyUser, oneSub);
router.get("/search/:name", Search);

export default router;
