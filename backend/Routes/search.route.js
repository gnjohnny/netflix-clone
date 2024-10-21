import { Router } from "express";
import { getSearchHistory, removeItemFromSeacrhHistory, searchMovie, searchPerson, searchTv } from "../controllers/search.controller.js";

const router = Router();

router.get("/person/:query", searchPerson)
router.get("/movie/:query", searchMovie)
router.get("/tv/:query", searchTv)

router.get("/history", getSearchHistory)

router.delete("/history/:id", removeItemFromSeacrhHistory)

export default router;