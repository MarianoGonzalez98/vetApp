import { QueryResult } from "pg";
import { Auth, User } from "../interfaces/User.interface";
import { pool } from "../utils/db.handle";
import { verified } from "../utils/bycrypt.handle";

const registerCliente = async (user:User) => {

};

//devuelve el usuario si la autenticación fue correcta
const loginUser = async ({email,password}:Auth) => {
    const query = 'SELECT id, password, email, rol FROM public.usuarios WHERE email = $1'
    const values = [email]
    try{
        const response:QueryResult = await pool.query(query,values)
        const result:User = await response.rows[0];
        if (!result){
            return result;
        }
        const passwordHash = result.password;
        console.log(passwordHash);
        const passwordCoincide = await verified(password,passwordHash)

        if (!passwordCoincide){
            return "PASS_INCORRECTO";
        }
        return result;

    }
    catch(err){
        console.error("----Error en acceso a BD------");
        console.log(err);
        return "error";
    }

};

export {registerCliente, loginUser}