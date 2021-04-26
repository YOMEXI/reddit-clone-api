import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validate, isEmpty } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { promisify } from "util";

import { User } from "./../entities/User";
import { mapError } from "../middleware/trimedError";
import { Sub } from "../entities/Sub";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password, age } = req.body;

    const emailExist = await User.findOne({ email });
    const userExist = await User.findOne({ username });

    if (emailExist) {
      res.status(404);
      throw new Error("Email already exist");
    }

    if (userExist) {
      res.status(404);
      throw new Error("Username already exist");
    }

    //change password to string in the frontend
    const user = new User({ email, username, password, age });

    const errors = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json(mapError(errors));
    }

    await user.save();

    return res.status(200).json({
      message: "Registration Successful",
      user,
    });

    next();
  }
);

//

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    let errors: any = {};
    if (isEmpty(username)) errors.username = "Username should not be empty";
    if (isEmpty(password)) errors.password = "Password should not be empty";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = await User.findOne({ username });

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!user) {
      res.status(404);
      throw new Error("User Doesn't Exist ");
    }

    if (!checkPassword) {
      res.status(404);
      throw new Error("Incorrect password");
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 360000,
        path: "/",
      })
    );

    res.status(200).json({
      message: "login successfull",
      user,
    });
  }
);

const authorize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Please Log In");
    }

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const stillTheUser = await User.findOne({ username });

    if (!stillTheUser) {
      res.status(401);
      throw new Error("User No Longer Exist");
    }

    (<any>req).user = stillTheUser;
    next();
  }
);

const OnlyUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (!req.headers.cookie) {
      return next();
    }
    if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    }

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const stillTheUser = await User.findOne({ username });

    (<any>req).user = stillTheUser;
    next();
  }
);

const UserOwnSub = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: User = (<any>req).user;

    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

    if (sub.username !== user.username) {
      res.status(401);
      throw new Error("Sub is not yours");
    }

    next();
  }
);

const userDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = (<any>req).user;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401);
      throw new Error("User doesn't exist");
    }

    res.json(user);
  }
);

const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );

    res.status(200).json({ success: true });
  }
);

export {
  register,
  login,
  userDetails,
  authorize,
  logout,
  OnlyUser,
  UserOwnSub,
};
