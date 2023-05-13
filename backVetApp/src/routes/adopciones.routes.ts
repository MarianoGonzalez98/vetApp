import { Router } from "express"

import { insertAdopcion } from "../controllers/adopciones";
import { checkJWT } from "../middleware/session";

const AdopcionesRouter = Router();
/* 
    http://localhost:3000/api/adopciones
*/
AdopcionesRouter.post('/adopciones/crear-publicacion', checkJWT,insertAdopcion)



export { AdopcionesRouter}