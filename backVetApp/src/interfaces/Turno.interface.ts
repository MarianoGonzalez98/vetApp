export interface Turno {
    id:number
    motivo: string
    perroNombre:string
    perroId: number // id del perro
    fecha: Date
    rangoHorario: string
    emailOwner: string
    aceptado: boolean
    descripcion: string
}

