import { Request, Response } from "express";
import { getUser , changePass, setPrimerLoginHecho, getCurrentPass, insertUser} from "../services/auth.service";
import { Auth, UserData, Persona } from "../interfaces/User.interface";
import { decodeToken, generateToken } from "../utils/jwt.handle";
import { encrypt, verified } from "../utils/bycrypt.handle";
import { generateRandomString } from "../utils/random.handle";

const registrarController = async  (req:Request, res:Response) => {
    const cliente:Persona = req.body;

    const result = await getUser(cliente.email);
    if (result==="error"){
        //HTTP 500 Internal server error
        res.status(500).send({data:"posible error en base de datos", statusCode:500})
        return
    }
    if (result){ //si devuelve un elemento es que existe el usuario
        //409 conflict
        res.status(409).send({data:"El email del cliente ya se encuentra registrado", statusCode:409})
        return
    }

    const randomPassword = generateRandomString();
    const hashedPassword = await encrypt(randomPassword);
    const dbResult = await insertUser({...cliente,password:hashedPassword, rol:'cliente'});
    if (dbResult === 'error'){
        //HTTP 500 Internal server error
        res.status(500).send({data:"posible error en base de datos", statusCode:500})
        return
    }
    //enviarMail(cliente.email,randomPassword) //despues lo hago para no llenarme de mails
    //201 Created
    res.status(201).send('Se registró correctamente al cliente');
};

const loginController = async (req:Request, res:Response) => {
    const authData:Auth = {email: req.body.email , password:req.body.password}
    const result= await getUser(authData.email)
    if (result==="error"){
        //HTTP 500 Internal server error
        res.status(500).send({data:"posible error en base de datos", statusCode:500})
        return
    }
    if (!result){
        //404 Not Found
        res.status(404).send({data:"no existe el usuario", statusCode:404}); 
        return
    }
    const passwordHash = result.password;
    const passwordCoincide = await verified(authData.password,passwordHash)
    if(!passwordCoincide){
        //401 Unauthorized
        res.status(401).send({data:"password incorrecto", statusCode:402})
        return
    }
    const userData:UserData = {email:result.email, rol:result.rol, primerLoginHecho:result.primerLoginHecho}; //creo q se puede mejorar
    console.log("LOGIN CRONTROLLER:")
    console.log(userData);
    const token = await generateToken(userData); //genero jwt token
    if (userData.primerLoginHecho===false){ //si este es su primer login, lo persisto en bd al hecho.
        setPrimerLoginHecho(userData.email); 
    }
    res.cookie('jwt',token,{httpOnly:true}); //mando el jwt en una cookie httpOnly
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

export {registrarController, loginController,logoutController, changePassController}