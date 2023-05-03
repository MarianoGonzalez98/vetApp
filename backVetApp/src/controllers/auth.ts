import { Request, Response } from "express";
import { loginUser, registerCliente } from "../services/auth.service";
import { Auth, UserData } from "../interfaces/User.interface";
import { generateToken, verifyToken } from "../utils/jwt.handle";

const registerController = async  (req:Request, res:Response) => {
    //const responseCliente = await registerCliente();
};

const loginController = async (req:Request, res:Response) => {
    const authData:Auth = {email: req.body.email , password:req.body.password}
    const result= await loginUser(authData)
    //habria que refactorizar lo de abajo
    if (!result){
        res.status(401).send({data:"no existe el usuario", statusCode:401}); 
        return
    }
    if(result==="PASS_INCORRECTO"){
        res.status(402).send({data:"password incorrecto", statusCode:402})
        return
    }
    if (result==="error"){
        res.status(401).send({data:"posible error en base de datos", statusCode:403})
        return
    }
    const userData:UserData = {email:result.email, rol:result.rol}; //creo q se puede mejorar
    const token = await generateToken(userData);
    const bearerToken =`Bearer ${token}`
    res.cookie('jwt',bearerToken,{httpOnly:true});
    res.send({data:{userData,token:token}})
};

const logoutController = async  (req:Request, res:Response) => {
    res.status(202)
    .clearCookie('jwt',{httpOnly:true, domain:"localhost"})
    .send('cookie cleared');
};

export {registerController, loginController,logoutController}