import { Router } from "express"

import { checkJWT } from "../middleware/session";
import { getBusquedas, insertBusqueda, marcarComoDuenoEncontrado } from "../controllers/busquedas";

const BusquedasRouter = Router();
/* 
    http://localhost:3000/api/busquedas
*/
BusquedasRouter.post('/busquedas/crear-publicacion', checkJWT,insertBusqueda)
BusquedasRouter.get('/busquedas/get-lista-encontrados',getBusquedas)
BusquedasRouter.post('/busquedas/marcar-encontrado', checkJWT,marcarComoDuenoEncontrado)


export { BusquedasRouter}