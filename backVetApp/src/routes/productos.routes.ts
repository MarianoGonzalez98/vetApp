import { Router } from "express"
import { checkJWT } from "../middleware/session";
import { checkRol } from "../middleware/checkRol";
import { getProductosController, insertProductoController } from "../controllers/productos";

export const ProductosRouter = Router();

ProductosRouter.post("/productos/crear-producto", checkJWT, checkRol, insertProductoController);
ProductosRouter.get("/productos",  getProductosController);