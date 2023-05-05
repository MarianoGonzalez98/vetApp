import { Router } from "express"
import { loginController ,logoutController,changePassController} from "../controllers/auth";
import { checkJWT } from "../middleware/session";

const AuthRouter = Router();
AuthRouter.post("/register");
AuthRouter.post("/login",loginController);
AuthRouter.post("/logout",logoutController);
AuthRouter.put("/changePass",checkJWT,changePassController);
export { AuthRouter}