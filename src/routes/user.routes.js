import { Router } from "express";
import { userRegister } from "../controller/user.cotroller.js";

const router = Router()

router.route("/register").post(userRegister)


export default router