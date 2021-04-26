import express from "express";

import {
  register,
  login,
  userDetails,
  authorize,
  logout,
} from "./../controllers/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authorize, userDetails);
router.get("/logout", logout);

export default router;
