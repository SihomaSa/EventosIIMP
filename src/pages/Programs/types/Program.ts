export type Program = {
  fechaPrograma: string;
  detalles: {
    descripcion: string;
    idPrograma: number;
    idEvento: number;
    detalleAdicional: DetalleAdicional[];
  }[];
};

type DetalleAdicional = {
  descripcionBody: string;
  idPrograma: number;
  idAutor: null | string;
  nombres: string | null;
  sala: string;
  horaIni: string;
  horaFin: string;
  idProDetalle: number;
  idIdioma: number;
  descIdioma: DescIdioma;
  prefijoIdioma: PrefijoIdioma;
  tipoPrograma: number;
};

type DescIdioma = "ESPAÑOL" | "INGLES";

type PrefijoIdioma = "EN" | "SP";
