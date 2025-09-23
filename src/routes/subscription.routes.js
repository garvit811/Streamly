import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { toggleSubscription } from "../controller/subscription.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/subscribe_toggle/:c_id").post(toggleSubscription)

export default router