export interface Perro {
    nombre:string,
    raza:string,
    sexo:string,
    fechaNacimiento:Date,
    observaciones:string;
    historiaClinica: null,//Turno[]
    libretaSanitaria: LibretaSanitaria
} 

export interface LibretaSanitaria{
    peso:number,
    vacunasAplicadas:null,
    foto:null,
}