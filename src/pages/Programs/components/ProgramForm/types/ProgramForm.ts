export type ProgramForm = {
  fechaPrograma: string;
  descripcionPro: string;
  idEvento: 1;
  detalles: {
    descripcionBody: string;
    idAutor: string; // 1,2,3
    sala: string;
    horaIni: string;
    horaFin: string;
    idIdioma: number;
    tipoPrograma: number;
  }[];
};
