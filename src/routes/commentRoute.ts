import express from "express";

import { createComment, getApostComments } from "./../controllers/comment";
import { authorize, OnlyUser } from "./../controllers/auth";

const router = express.Router();

router.post("/:identifier/:slug/comment", authorize, createComment);
router.get("/:identifier/:slug/comment", OnlyUser, getApostComments);

export default router;
