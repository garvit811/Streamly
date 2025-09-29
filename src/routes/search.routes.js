import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { search } from "../controller/search.controller.js";

const router = Router()

router.route("/search").get(verifyJWT, search)

export default router