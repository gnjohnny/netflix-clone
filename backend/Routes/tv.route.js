import { Router } from "express";
import { getSimilarTv, getTrendingTv, getTvByCategory, getTvDetails, getTvTrailer } from "../controllers/tv.controller.js";

const router = Router()

router.get("/trending", getTrendingTv)
router.get("/:id/trailers", getTvTrailer)
router.get("/:id/details", getTvDetails)
router.get("/:id/similar", getSimilarTv)
router.get("/:category", getTvByCategory)

export default router;