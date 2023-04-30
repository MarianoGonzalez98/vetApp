import { Router } from "express"

import { getAdopcion,getAdopciones } from "../controllers/adopciones";

const AdopcionesRouter = Router();
const URL="/api/adopciones"
/* 
    http://localhost/3000/adopciones
*/
AdopcionesRouter.get(URL, getAdopciones)

AdopcionesRouter.get(URL+"/:id", getAdopcion)
export { AdopcionesRouter}