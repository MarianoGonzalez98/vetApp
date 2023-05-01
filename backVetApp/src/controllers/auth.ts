import { Request, Response } from "express";
import { loginUser, registerCliente } from "../services/auth.service";
import { Auth, User } from "../interfaces/User.interface";

const registerController = async  (req:Request, res:Response) => {
    //const responseCliente = await registerCliente();
};

const loginController = async (req:Request, res:Response) => {
    const authData:Auth = {email: req.body.email , password:req.body.password}
    const result= await loginUser(authData)
    //habria que refactorizar lo de abajo
    if (!result){
        res.send({data:"no existe el usuario", statusCode:401}); 
        return
    }
    if(result==="PASS_INCORRECTO"){
        res.send({data:"password incorrecto", statusCode:401})
        return
    }
    if (result==="error"){
        res.send({data:"posible error en base de datos", statusCode:401})
        return
    }


    res.send({data:"LOGIN EFECTUADO"})
};

export {registerController, loginController}