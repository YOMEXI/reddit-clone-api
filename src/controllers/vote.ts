import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { Vote } from "../entities/Vote";

const vote = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug, commentIdentifier, value } = req.body;

    if (![-1, 0, 1].includes(value)) {
      res.status(400);
      throw new Error("Value must be -1,0,1");
    }

    const user: User = (<any>req).user;

    let post = await Post.findOneOrFail({ identifier, slug });

    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      res.status(400);
      throw new Error("Vote not found");
    } else if (!vote) {
      vote = new Vote({ user, value });
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();
    } else if (value == 0) {
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comments", "comments.votes", "sub", "votes"] }
    );

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    return res.json(post);
  }
);

export { vote };
