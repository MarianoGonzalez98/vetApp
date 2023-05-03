import { Router } from "express"
import { loginController ,logoutController} from "../controllers/auth";

const AuthRouter = Router();

AuthRouter.post("/register");
AuthRouter.post("/login",loginController);
AuthRouter.post("/logout",logoutController);

export { AuthRouter}