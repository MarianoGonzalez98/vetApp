import { Request, Response } from "express";
import { getUser, changePass, getCurrentPass, insertUser, insertPassword, actualizarPasswordDevelop, setSeCambioPassword, getUserCompleto, updatePerfilUsuario, getUserConDni } from "../services/auth.service";
import { Auth, UserData, Persona } from "../interfaces/User.interface";
import { decodeToken, generateToken } from "../utils/jwt.handle";
import { encrypt, verified } from "../utils/bycrypt.handle";
import { generateRandomString } from "../utils/random.handle";
import { User } from "../interfaces/User.interface";
import { decodeToHTML_JPEG, encodeRezizeImgToJPEG } from "../utils/img.handle";
import { sendMailTest } from "../utils/mailer.handle";

export const getExisteUsuarioConDni = async (req: Request, res: Response) => {
    const dni: string = req.body.dni;
    const existeUsuario = await getUserConDni(dni);
    if (existeUsuario === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (existeUsuario){
        res.status(409).send("Ya se encuentra un usuario registrado con ese dni")
        return
    }
    return res.status(200).send('DNI valido para registro');
}

export const getExisteUsuarioConEmail = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const existeUsuario = await getUserCompleto(email);
    if (existeUsuario === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (existeUsuario){
        res.status(409).send("Ya se encuentra un usuario registrado con ese email")
        return
    }
    return res.status(200).send('Email valido para registro');
}
export const getMiPerfilController = async (req: Request, res: Response) => {
    const result = await getUserCompleto(res.locals.jwtData.user.email);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    let fotoHTML = "";
    if (result.foto){
        fotoHTML = decodeToHTML_JPEG(result.foto);
    }
    
    res.send({
        nombre:result.nombre,
        apellido:result.apellido,
        dni:result.dni,
        direccion:result.direccion,
        telefono:result.telefono,
        fechaNacimiento:result.fechaNacimiento,
        foto:fotoHTML
    })
}

export const updateMiPerfilController = async (req: Request, res: Response) => {
    const cliente: Persona = req.body;
    const emailJWT = res.locals.jwtData.user.email
    const existeUsuario = await getUser(emailJWT);
    if (existeUsuario === 'error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos")
        return
    }
    if (!existeUsuario){
        res.status(404).send('El usuario no existe');
    }

    if (cliente.foto){
        cliente.foto= await encodeRezizeImgToJPEG(cliente.foto) || "";
    }
    const result = await updatePerfilUsuario(cliente,emailJWT)
    if (result === 'error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos")
        return
    }
    return res.status(200).send('Se actualizó el perfil correctamente.');
}

const registrarController = async (req: Request, res: Response) => {
    const cliente: Persona = req.body;

    const result = await getUser(cliente.email);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (result) { //si devuelve un elemento es que existe el usuario
        //409 conflict
        res.status(409).send({ data: "El email del cliente ya se encuentra registrado", statusCode: 409 })
        return
    }

    const randomPassword = generateRandomString();
    const hashedPassword = await encrypt(randomPassword);
    const dbResult = await insertUser({ ...cliente, password: hashedPassword, rol: 'cliente' });
    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    //enviarMail(cliente.email,randomPassword) //despues lo hago para no llenarme de mails
/*     let asunto="Contraseña del sitio web Oh my dog!"
    let texto="Su contraseña es: "+ randomPassword;
    sendMailTest(cliente.email,asunto,texto); */
    //SOLO EN DEVELOP-------------------------

    await insertPassword(cliente.email, randomPassword);

    //FIN SOLO DEVELOP-------------
    //201 Created
    res.status(201).send('Se registró correctamente al cliente');
};

const loginController = async (req: Request, res: Response) => {
    const authData: Auth = { email: req.body.email, password: req.body.password }
    const result = await getUser(authData.email)
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (!result) {
        //404 Not Found
        res.status(404).send({ data: "no existe el usuario", statusCode: 404 });
        return
    }
    const passwordHash = result.password;
    const passwordCoincide = await verified(authData.password, passwordHash)
    if (!passwordCoincide) {
        //401 Unauthorized
        res.status(401).send({ data: "password incorrecto", statusCode: 402 })
        return
    }
    const userData: UserData = { email: result.email, rol: result.rol, seCambioPassword: result.seCambioPassword }; //creo q se puede mejorar
    console.log("LOGIN CRONTROLLER:")
    console.log(userData);
    const token = await generateToken(userData); //genero jwt token
    res.cookie('jwt', token, { httpOnly: true, maxAge:11704085200 }); //mando el jwt en una cookie httpOnly
    res.send({ data: { userData, token: token } })
};

const logoutController = async (req: Request, res: Response) => {
    res.status(202)
        .clearCookie('jwt', { httpOnly: true, domain: "localhost" })
        .send('cookie cleared');
};

const changePassController = async (req: Request, res: Response) => {
    const passwordInput: string = req.body.password;
    const decodedToken = decodeToken(req.cookies.jwt)
    if (decodedToken === null) {
        console.log('Problem at decoding jwt in changePassController');
        res.status(411).send('Problen at decoding jwt in changePassController');
        return
    }
    const user: UserData = res.locals.jwtData.user;
    //checkeo que el password sea diferente al actual
    const currentPassHash = await getCurrentPass(user.email);
    const passwordCoincide = await verified(passwordInput, currentPassHash)
    if (passwordCoincide) {
        res.status(409).send('La nueva contraseña debe ser diferente a la actual');
        return;
    }
    //aca validar que sea de min 6 car, con un num y un car especial
    //......
    console.log("changePassController PASS q sera ENCRIPTADA:" + passwordInput);
    const hashedPass = await encrypt(passwordInput);
    const updateDone = await changePass({ email: user.email, password: hashedPass }); //toma el dato del jwt y la contraseña q mando por el body

    if (updateDone) {
        //SOLO EN DEVELOP ----------------
        await actualizarPasswordDevelop(user.email, passwordInput);
        //FIN SOLO EN DEVELOP ----------------
        setSeCambioPassword(user.email);
        res.status(202).send('Password Update done');

    }
    else
        res.status(401).send('Problem at updating password');
}

export { registrarController, loginController, logoutController, changePassController }