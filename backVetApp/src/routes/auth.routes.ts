import { Router } from "express"
import { loginController, logoutController, changePassController, registrarController, getMiPerfilController, updateMiPerfilController, getExisteUsuarioConDni, getExisteUsuarioConEmail } from "../controllers/auth";
import { checkJWT } from "../middleware/session";
import { checkRol } from "../middleware/checkRol";
const AuthRouter = Router();

AuthRouter.post("/existeUsuarioConDni",checkJWT,checkRol,getExisteUsuarioConDni);
AuthRouter.post("/existeUsuarioConEmail",checkJWT,checkRol,getExisteUsuarioConEmail);
AuthRouter.post("/registrar-cliente", checkJWT, checkRol, registrarController,); //agregar middleweare para checkeo de rol
AuthRouter.post("/login", loginController);
AuthRouter.post("/logout", logoutController);
AuthRouter.put("/changePass", checkJWT, changePassController);

AuthRouter.get("/getPerfil",checkJWT, getMiPerfilController)
AuthRouter.put("/updatePerfil",checkJWT, updateMiPerfilController)
export { AuthRouter }