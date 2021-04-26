import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validate, isEmpty } from "class-validator";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import { Comment } from "../entities/Comment";

const createComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;
    const { body } = req.body;

    const post = await Post.findOneOrFail({ identifier, slug });

    if (!post) {
      res.status(404);
      throw new Error("Post doesn't exist");
    }

    const comment = new Comment({
      body,
      user: (<any>req).user,
      post,
    });

    await comment.save();
    return res.status(200).json(comment);
  }
);

const getApostComments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;

    const post = await Post.findOneOrFail({ identifier, slug });

    if (!post) {
      res.status(404);
      throw new Error("Post doesn't exist");
    }

    const comment = await Comment.find({
      where: { post },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });

    if ((<any>req).user) {
      comment.forEach((p) => p.setUserVote((<any>req).user));
    }
    res.status(200).json(comment);
  }
);

export { createComment, getApostComments };
