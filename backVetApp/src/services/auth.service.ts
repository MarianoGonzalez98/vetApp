import { QueryResult } from "pg";
import { Auth, Persona, Rol, User } from "../interfaces/User.interface";
import { pool } from "../utils/db.handle";
import { verified } from "../utils/bycrypt.handle";


//solo en develop--------------------------------------DESPUES SACAR-------------

const insertPassword = async (email: string, password: string) => {
    const queryPasword = `
    INSERT INTO public.passwords(
        email, password)
        VALUES ($1, $2);
    `;
    const valuesPassword = [email, password]
    try {
        const response: QueryResult = await pool.query(queryPasword, valuesPassword) //hace la query
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertPassword------");
        console.log(err);
        return "error";
    }
}

const actualizarPasswordDevelop = async (email: string, password: string) => {
    const queryPasword = `
    UPDATE public.passwords
	SET password= $1
	WHERE email = $2;
    `;
    const valuesPassword = [password, email]
    try {
        const response: QueryResult = await pool.query(queryPasword, valuesPassword) //hace la query
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarPassword------");
        console.log(err);
        return "error";
    }
}




//FIN --------------------------------------DESPUES SACAR-------------

export const updatePerfilUsuario = async ({nombre,apellido,dni,fechaNacimiento,direccion,telefono,foto}:Persona, email:string) => {
    const query = `
    UPDATE public.usuarios u
	SET nombre=$1, apellido=$2, dni=$3, "fechaNacimiento"=$4, direccion=$5, telefono=$6, foto=$7
	WHERE u.email = $8;
    `
    const values = [nombre,apellido,dni,fechaNacimiento,direccion,telefono,foto,email];
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:updatePerfilUsuario------");
        console.log(err);
        return "error";
    }

}

const insertUser = async (usuario: Persona & Auth & Rol) => { //las intersecciones capaz se puedan mejorar
    console.log(usuario);
    const query = `
    INSERT INTO public.usuarios(
        password, email, rol, "seCambioPassword", nombre, apellido, dni, "fechaNacimiento", direccion, telefono, foto)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `
    const values = [usuario.password, usuario.email, usuario.rol, false, usuario.nombre, usuario.apellido, usuario.dni, usuario.fechaNacimiento, usuario.direccion, usuario.telefono, usuario.foto]

    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertUser------");
        console.log(err);
        return "error";
    }
}

//devuelve el usuario si existe

const getUser = async (email: string) => {
    const query = `
    SELECT id, password, email, rol, "seCambioPassword" 
    FROM public.usuarios 
    WHERE email = $1
    `
    const values = [email]
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        const result: User = await response.rows[0];
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getUser------");
        console.log(err);
        return "error";
    }
};

export const getUserConDni = async (dni: string) => {
    const query = `
    SELECT id, password, email, rol, "seCambioPassword" 
    FROM public.usuarios 
    WHERE dni = $1
    `
    const values = [dni]
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        const result: User = await response.rows[0];
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getUserConDni------");
        console.log(err);
        return "error";
    }
};

export const getUserCompleto = async (email: string) => {
    const query = `
    SELECT id, password, email, rol, "seCambioPassword", nombre, apellido, dni, "fechaNacimiento", direccion, telefono, foto
	FROM public.usuarios
    WHERE email = $1
    `
    const values = [email]
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        const result:User&Persona = await response.rows[0];
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getUserCompleto------");
        console.log(err);
        return "error";
    }
};


const getCurrentPass = async (email: string) => {
    const query = `
    SELECT password 
    FROM public.usuarios 
    WHERE email = $1
    `;
    const values = [email]
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        const passwordJSON = await response.rows[0];
        const passwordHash = passwordJSON.password;
        return passwordHash;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getCurrentPass------");
        console.log(err);
        return "error";
    }
}

const changePass = async ({ email, password }: Auth) => {
    const query = `
    UPDATE public.usuarios
	SET password = $1
	WHERE email = $2
    `;
    const values = [password, email];
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        return true;
    }
    catch (err) {
        console.error("----Error en acceso a BD:changePass------");
        console.log(err);
        return false;
    }
}

const setSeCambioPassword = async (email: string) => {
    //por ahora solo setea SeCambioPassword inicio en falso
    const query = `
    UPDATE public.usuarios
	SET "seCambioPassword" = true
	WHERE email = $1
    `;
    const values = [email];
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        return true;
    }
    catch (err) {
        console.error("----Error en acceso a BD:setSeCambioPassword------");
        console.log(err);
        return false;
    }
}



export { getUser, changePass, setSeCambioPassword, getCurrentPass, insertUser, insertPassword, actualizarPasswordDevelop }