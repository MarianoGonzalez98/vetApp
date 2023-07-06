import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.handle";

export const checkJWT = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const jwtToken = req.cookies.jwt;
        const verificado = await verifyToken(jwtToken);
        res.locals.jwtData=verificado; //si llega a esta linea, es que el jwt no fue modificado y lo guardo en user local
        next();
    } catch (error) {
        console.log("Falla de jwt. valor del token: "+req.cookies.jwt);
        res.status(400);
        res.send('SESION_NO_VALIDA. FALLA EN EL JWT.');
    }
}