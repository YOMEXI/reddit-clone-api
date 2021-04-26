import express from "express";
import { authorize } from "../controllers/auth";
import { vote } from "../controllers/vote";

const router = express.Router();

router.post("/vote", authorize, vote);

export default router;
