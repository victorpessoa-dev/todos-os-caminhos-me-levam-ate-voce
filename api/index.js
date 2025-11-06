import express from "express";
import postsRouter from "./posts/router.js";
import galleryRouter from "./gallery/router.js";
import aboutRouter from "./about/router.js";

const router = express.Router();

router.use("/posts", postsRouter);
router.use("/gallery", galleryRouter);
router.use("/about", aboutRouter);

export default router;