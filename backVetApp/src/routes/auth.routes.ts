import { Router } from "express"
import { loginController } from "../controllers/auth";

const AuthRouter = Router();

AuthRouter.post("/register");
AuthRouter.post("/login",loginController);

export { AuthRouter}