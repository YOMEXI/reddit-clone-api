import express from "express";

import { createPost, getAllPosts, singlePost } from "./../controllers/post";
import { authorize, OnlyUser } from "./../controllers/auth";

const router = express.Router();

router.post("/create", authorize, createPost);
router.get("/", OnlyUser, getAllPosts);
router.get("/:identifier/:slug", OnlyUser, singlePost);

export default router;
