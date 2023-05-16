import { Router } from "express"

import { getAdopciones, insertAdopcion } from "../controllers/adopciones";
import { checkJWT } from "../middleware/session";

const AdopcionesRouter = Router();
/* 
    http://localhost:3000/api/adopciones
*/
AdopcionesRouter.post('/adopciones/crear-publicacion', checkJWT,insertAdopcion)
AdopcionesRouter.get('/adopciones/get-lista-adopciones',getAdopciones)


export { AdopcionesRouter}