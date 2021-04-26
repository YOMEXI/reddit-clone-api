import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";

const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers.cookie);

    const { body, title, sub } = req.body;
    console.log({ body, title, sub });
    let user = (<any>req).user;

    user.password = false;

    if (title.trim() === "") {
      res.status(400);
      throw new Error("Title cant be empty");
    }

    const subscription = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ body, title, sub: subscription, user });

    await post.save();

    res.status(200).json(post);
  }
);

const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentPage: number = (req.query.page || 0) as number;
    const postPerPage: number = (req.query.count || 3) as number;

    const post = await Post.find({
      order: { createdAt: "DESC" },
      relations: ["comments", "sub", "votes"],
      skip: currentPage * postPerPage,
      take: postPerPage,
    });

    if ((<any>req).user) {
      post.forEach((p) => p.setUserVote((<any>req).user));
    }
    res.status(200).json(post);
  }
);

const singlePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug } = req.params;

    const post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["sub", "votes"] }
    );

    if ((<any>req).user) {
      post.setUserVote((<any>req).user);
    }

    if (!post) {
      res.status(404);
      throw new Error("Post doesn't exist");
    }

    res.status(200).json(post);
  }
);

export { createPost, getAllPosts, singlePost };
