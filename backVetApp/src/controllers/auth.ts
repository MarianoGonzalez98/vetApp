import { Request, Response } from "express";
import { loginUser, registerCliente , changePass, setPrimerLoginHecho, getCurrentPass} from "../services/auth.service";
import { Auth, UserData } from "../interfaces/User.interface";
import { decodeToken, generateToken, verifyToken } from "../utils/jwt.handle";
import { JwtPayload } from "jsonwebtoken";
import { encrypt, verified } from "../utils/bycrypt.handle";

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
    const userData:UserData = {email:result.email, rol:result.rol, primerLoginHecho:result.primerLoginHecho}; //creo q se puede mejorar
    console.log("LOGIN CRONTROLLER:")
    console.log(userData);
    const token = await generateToken(userData);
    if (userData.primerLoginHecho===false){ //si este es su primer login, lo persisto en bd al hecho.
        setPrimerLoginHecho(userData.email); 
    }
    res.cookie('jwt',token,{httpOnly:true});
    res.send({data:{userData,token:token}})
};

const logoutController = async  (req:Request, res:Response) => {
    res.status(202)
    .clearCookie('jwt',{httpOnly:true, domain:"localhost"})
    .send('cookie cleared');
};

const changePassController = async  (req:Request, res:Response) => {
    const passwordInput:string = req.body.password;
    const decodedToken = decodeToken(req.cookies.jwt)
    if (decodedToken===null){
        console.log('Problem at decoding jwt in changePassController');
        res.status(411).send('Problen at decoding jwt in changePassController');
        return
    }
    const user:UserData = res.locals.jwtData.user;
    //checkeo que el password sea diferente al actual
    const currentPassHash = await getCurrentPass(user.email);
    const passwordCoincide = await verified(passwordInput,currentPassHash)
    if (passwordCoincide){
        res.status(409).send('La nueva contraseña debe ser diferente a la actual');
        return;
    }
    //aca validar que sea de min 6 car, con un num y un car especial
    //......
    console.log("changePassController PASS q sera ENCRIPTADA:"+passwordInput);
    const hashedPass = await encrypt(passwordInput);
    const updateDone = await changePass({email: user.email ,password: hashedPass}); //toma el dato del jwt y la contraseña q mando por el body

    if (updateDone){
        res.status(202).send('Password Update done');
    }
    else
        res.status(401).send('Problem at updating password');
}

export {registerController, loginController,logoutController, changePassController}