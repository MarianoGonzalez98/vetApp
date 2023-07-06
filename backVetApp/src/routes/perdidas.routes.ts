import { Router } from "express"

import { checkJWT } from "../middleware/session";
import { getPerdidas, insertPerdida, marcarComoEncontrado } from "../controllers/perdidas";

const PerdidasRouter = Router();
/* 
    http://localhost:3000/api/perdidas
*/
PerdidasRouter.post('/perdidas/crear-publicacion', checkJWT,insertPerdida)
PerdidasRouter.get('/perdidas/get-lista-perdidos',getPerdidas)
PerdidasRouter.post('/perdidas/marcar-encontrado', checkJWT,marcarComoEncontrado)


export { PerdidasRouter}