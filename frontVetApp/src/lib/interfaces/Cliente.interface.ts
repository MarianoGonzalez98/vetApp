export interface Cliente {
    nombre: string
    apellido: string
    email: string
}

export interface ExtrasCliente {
    dni: string
    fechaNacimiento: string
    direccion: string
    telefono: string
    foto: any
}

export interface ClienteConMonto {
    nombre: string
    apellido: string
    email: string
    montoAcumuladoDescuento:number
}