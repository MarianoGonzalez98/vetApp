import { QueryResult } from "pg";
import { Auth, User } from "../interfaces/User.interface";
import { pool } from "../utils/db.handle";
import { verified } from "../utils/bycrypt.handle";

const registerCliente = async (user:User) => {

};

//devuelve el usuario si la autenticación fue correcta
const loginUser = async ({email,password}:Auth) => {
    const query = `
    SELECT id, password, email, rol, "primerLoginHecho" 
    FROM public.usuarios 
    WHERE email = $1
    `
    const values = [email]
    try{
        const response:QueryResult = await pool.query(query,values) //hace la query
        const result:User = await response.rows[0];
/*         if (!result){ //si no hay ningun resultado
            return result; //esto capaz este bueno cambiarlo
        } */
/*         const passwordHash = result.password;
        const passwordCoincide = await verified(password,passwordHash) */

/*         if (!passwordCoincide){
            return "PASS_INCORRECTO";
        } */
        return result;
    }
    catch(err){
        console.error("----Error en acceso a BD:loginUser------");
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

export {registerCliente, loginUser, changePass,setPrimerLoginHecho, getCurrentPass}