export interface ExpositorType {
  idautor: number;
  nombres: string;
  apellidos: string;
  especialidad: string;
  hojavida: string;
  foto: string;
  // TODO: Determinar si idautor es un error ortográfico
  idAutor: number;
}

export interface NewExpositorType {
  nombres: string;
  apellidos: string;
  especialidad: string;
  hojaDeVida: string;
  foto: string;
}
