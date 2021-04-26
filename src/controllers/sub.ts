import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validate, isEmpty } from "class-validator";
import { getConnection, getRepository } from "typeorm";
import formidable from "formidable";
import { v2 } from "cloudinary";
let cloudinary = v2;

import { Sub } from "../entities/Sub";
import { Post } from "../entities/Post";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
//
const createSub = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, title, description } = req.body;

    let user = (<any>req).user;
    user.password = false;

    let errors: any = {};
    if (isEmpty(title)) errors.title = "title should not be empty";
    if (isEmpty(name)) errors.name = "name should not be empty";

    //check if sub exists using typeorm querybuilder

    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub already exists";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //

    const newSub = new Sub({ name, title, description, user });

    if (!newSub) {
      res.status(400);
      throw new Error("Sub creation error");
    }

    await newSub.save();

    return res.status(200).json({ message: "Sub Created" });
  }
);

const oneSub = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });
    sub.posts = posts;
    if ((<any>req).user) {
      posts.forEach((p) => p.setUserVote((<any>req).user));
    }

    res.status(200).json(sub);
  }
);

const SubImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({ multiples: true });
    const { name } = req.params;

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        res.status(404);
        throw new Error("File  Upload error");
      }

      const { image } = files;

      //
      const sub = await Sub.findOneOrFail({ name });
      if (image === "" || !image) {
        res.status(404);
        throw new Error("Image  Upload error");
      }

      if (sub && image) {
        cloudinary.uploader.upload(
          image.path,
          {
            resource_type: "auto",
            public_id: `my_folder/${image.path}`,
            overwrite: true,
          },
          async function (error, result) {
            (sub.imageUrl = result.url),
              (sub.imageUrl_Id = result.public_id),
              await sub.save();

            return res.status(200).json("Image Uploaded");
          }
        );
      }
    });
  }
);

const popularSub = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const sub = await getConnection()
      .createQueryBuilder()
      .select(`sub.title,sub.name,sub."imageUrl",count(post.id) as "postCount"`)
      .from(Sub, "sub")
      .leftJoin(Post, "post", `sub.name=post."subName"`)
      .groupBy(`sub.title,sub.name,sub."imageUrl"`)
      .orderBy(`"postCount"`, "DESC")
      .limit(4)
      .execute();

    res.status(200).json(sub);
  }
);

const Search = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where("LOWER(name) LIKE :name", {
        name: `%${name.toLowerCase().trim()}%`,
      })
      .getMany();

    res.status(200).json(subs);
  }
);

export { createSub, oneSub, SubImage, popularSub, Search };
