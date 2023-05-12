import { Router } from "express"
import { getTurnos } from "../controllers/turnos";
/* importar controladores */


const TurnosRouter = Router();
/* 
    http://localhost:3000/api/turnos
*/
TurnosRouter.get("/api/turnos", getTurnos)


export { TurnosRouter}