import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { NombreApellidoMailPersona, User } from "../interfaces/User.interface";

export const getClientes = async () => {
    const query = `
    SELECT u.email, u.nombre, u.apellido
    FROM public.usuarios u
    WHERE u.rol = 'cliente'
    `
    try {
        const response: QueryResult = await pool.query(query)
        const result: NombreApellidoMailPersona[] = await response.rows
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getClientes------");
        console.log(err);
        return "error";
    }

}

export const getClientesCompletos = async () => {
    const query = `
    SELECT *
    FROM public.usuarios
    WHERE rol = 'cliente'
    `
    try {
        const response: QueryResult = await pool.query(query)
        const result: NombreApellidoMailPersona[] = await response.rows
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getClientesCompleto------");
        console.log(err);
        return "error";
    }

}

export const getCliente = async (email: string) => {
    const query = `
    SELECT id, password, email, rol, "seCambioPassword"
    FROM public.usuarios 
    WHERE email = $1 and rol = 'cliente'
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

export const sumarAMontoAcumuladoDescuentoCliente = async (email:string,monto:number) => {
    const query = `
    UPDATE public.usuarios
	SET "montoAcumuladoDescuento"= "montoAcumuladoDescuento" + $1
	WHERE email = $2 and rol = 'cliente'
    `
    const values= [monto,email];
    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:sumarAMontoAcumuladoDescuento------");
        console.log(err);
        return "error";
    }
}
