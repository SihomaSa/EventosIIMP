export type ProgramForm = {
  fechaPrograma: string;
  descripcionPro: string;
  idEvento: number;
  idPrograma?: number;
  detalles?: {
    descripcionBody?: string;
    idAutor?: string; // 1,2,3
    sala?: string;
    horaIni: string;
    horaFin: string;
    idIdioma?: number;
    tipoPrograma?: number;
  }[];
};
