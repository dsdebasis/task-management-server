import { Router } from "express";
import { login,register,logout } from "../controllers/user.js";
import { authenticate } from "../middleware/authenticate.js";
 const router = Router();

 router.route("/register").post(register)
 router.route("/login").post(login)
 router.route("/logout").post( authenticate,logout)


 export default  router;