import { Router } from "express"
import { checkJWT } from "../middleware/session";
import { checkRol } from "../middleware/checkRol";
import { getProductoPorIdController, getProductosController, insertProductoController, updateProductoPorIdController } from "../controllers/productos";

export const ProductosRouter = Router();

ProductosRouter.post("/productos/crear-producto", checkJWT, checkRol, insertProductoController);
ProductosRouter.get("/productos",  getProductosController);
ProductosRouter.get("/productos/:id",checkJWT,checkRol,getProductoPorIdController)
ProductosRouter.put("/productos/:id",checkJWT,checkRol,updateProductoPorIdController)