import { NextFunction, Request, Response } from "express";

export const checkRol = async (req: Request, res: Response, next: NextFunction) => {
    //console.log(res.locals.jwtData)
    if (res.locals.jwtData.user.rol === 'veterinario') {
        next();

    } else {
        res.status(403);
        res.send('No tiene permisos para esta operacion.');
    }

}

export const checkRolCliente = async (req:Request, res:Response, next: NextFunction) => {
    //console.log(res.locals.jwtData)
    if (res.locals.jwtData.user.rol === 'cliente'){
        next();
        
    }else{
        res.status(403);
        res.send('No tiene permisos para esta operacion.');
    }

}