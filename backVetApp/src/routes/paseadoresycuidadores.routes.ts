import { Router } from "express"

import { getPaseadoresCuidadores } from "../controllers/paseadoresycuidadores";

const PaseadoresCuidadoresRouter = Router();
const URL = "/api/paseadoresycuidadores"
/* 
    http://localhost:3000/api/paseadores-y-cuidadores
*/
PaseadoresCuidadoresRouter.get(URL, getPaseadoresCuidadores)