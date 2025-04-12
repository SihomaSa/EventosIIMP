export type Program = {
  fechaPrograma: string;
  detalles: ProgramDetail[];
};

export type ProgramDetail = {
  descripcion: string;
  idPrograma: number;
  idEvento: number;
  detalleAdicional: DetalleAdicional[];
};

type DetalleAdicional = {
  descripcionBody: string;
  idPrograma: number;
  sala: string;
  horaIni: string;
  horaFin: string;
  idProDetalle: number;
  idIdioma: number;
  descIdioma: DescIdioma;
  prefijoIdioma: PrefijoIdioma;
  tipoPrograma: number;
  autores: Autor[] | null;
};

type Autor = {
  apellidos: string;
  idAutor: number;
  nombres: string;
};

type DescIdioma = "ESPAÑOL" | "INGLES";

type PrefijoIdioma = "EN" | "SP";

export type ProgramCategory = {
  descripcion: string;
  idTipoPrograma: number;
};
