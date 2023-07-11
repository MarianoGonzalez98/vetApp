import { Router } from "express"
import { listarVeterinariasController } from "../controllers/veterinarias";

export const VeterinariasRouter = Router();

VeterinariasRouter.get("/listar-veterinarias", listarVeterinariasController);