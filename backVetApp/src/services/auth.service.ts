import { QueryResult } from "pg";
import { Auth, Persona, Rol, User } from "../interfaces/User.interface";
import { pool } from "../utils/db.handle";
import { verified } from "../utils/bycrypt.handle";


const insertUser = async (usuario:Persona&Auth&Rol) => { //las intersecciones capaz se puedan mejorar
    console.log(usuario);
    const query = `
    INSERT INTO public.usuarios(
        password, email, rol, "primerLoginHecho", nombre, apellido, dni, "fechaNacimiento", direccion, telefono, foto)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `
    const values = [usuario.password, usuario.email, usuario.rol, false, usuario.nombre, usuario.apellido, usuario.dni,usuario.fechaNacimiento,usuario.direccion,usuario.telefono,usuario.foto]

    try{
        const response:QueryResult = await pool.query(query,values) //hace la query
        return 'ok';
    }
    catch(err){
        console.error("----Error en acceso a BD:insertUser------");
        console.log(err);
        return "error";
    }
}

//devuelve el usuario si existe

const getUser = async (email:string) => {
    const query = `
    SELECT id, password, email, rol, "primerLoginHecho" 
    FROM public.usuarios 
    WHERE email = $1
    `
    const values = [email]
    try{
        const response:QueryResult = await pool.query(query,values) //hace la query
        const result:User = await response.rows[0];
        return result;
    }
    catch(err){
        console.error("----Error en acceso a BD:getUser------");
        console.log(err);
        return "error";
    }
};

const getCurrentPass = async (email:string) => {
    const query = `
    SELECT password 
    FROM public.usuarios 
    WHERE email = $1
    `;
    const values = [email]
    try{
        const response:QueryResult = await pool.query(query,values) //hace la query
        const passwordJSON = await response.rows[0];
        const passwordHash = passwordJSON.password;
        return passwordHash;
    }
    catch(err){
        console.error("----Error en acceso a BD:getCurrentPass------");
        console.log(err);
        return "error";
    }
}

const changePass = async ({email,password}:Auth) => {
    const query = `
    UPDATE public.usuarios
	SET password = $1
	WHERE email = $2
    `;
    const values = [password,email];
    try{
        const response:QueryResult = await pool.query(query,values) //hace la query
        return true;
    }
    catch(err){
        console.error("----Error en acceso a BD:changePass------");
        console.log(err);
        return false;
    }
}

const setPrimerLoginHecho = async (email:string) => {
    //por ahora solo setea primer inicio en falso
    const query = `
    UPDATE public.usuarios
	SET "primerLoginHecho" = true
	WHERE email = $1
    `;
    const values = [email];
    try{
        const response:QueryResult = await pool.query(query,values) //hace la query
        return true;
    }
    catch(err){
        console.error("----Error en acceso a BD:setPrimerLoginHecho------");
        console.log(err);
        return false;
    }
}

export {getUser, changePass,setPrimerLoginHecho, getCurrentPass, insertUser}