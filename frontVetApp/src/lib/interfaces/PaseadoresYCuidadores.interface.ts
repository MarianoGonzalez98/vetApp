export interface RangoDate {
    inicio: Date,
    fin: Date,
}

type Oficio = "Paseador" | "Cuidador"

export interface PaseadorCuidador {
    nombre: string,
    apellido: string,
    horario: RangoDate,
    fechas: RangoDate,
    telefono: string,
    mail: string,
    oficio: Oficio,
}