import { QueryResult } from "pg";
import { Perro } from "../interfaces/Perro.interface";

const getPerro = async (cliente: string, nombre: string) => {
    const query = `
    SELECT *
    FROM public.perros p INNER JOIN public.usuarios u ON (p.dueño = u.email)
    WHERE nombre = 
    `
}