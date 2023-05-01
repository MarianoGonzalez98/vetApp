import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.handle";

export const checkJWT = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const jwtByUser = req.headers.authorization || '';
        const jwt = jwtByUser.split(' ')[1]; // queda ['Bearer','token']
        const verificado = await verifyToken(jwt);
        res.locals.user=verificado; //si llega a esta linea, es que el jwt no fue modificado y lo guardo en user local
        next();
    } catch (error) {
        res.status(400);
        res.send('SESION_NO_VALIDA');
    }
}