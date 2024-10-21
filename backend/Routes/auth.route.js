import { Router } from "express";
import { signUp, logIn, logOut, authCheck } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router()

router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)

router.get("/authCheck",protectRoute ,authCheck)

export default router;