import { ProgramDetail } from "../../../types/Program";
import { ProgramForm } from "../types/ProgramForm";

export function mapProgramDetailToForm(
  program: ProgramDetail,
  date: string
): ProgramForm {
  return {
    descripcionPro: program.descripcion,
    idEvento: program.idEvento,
    fechaPrograma: date,
    detalles: program.detalleAdicional.map((detail) => {
      return {
        descripcionBody: detail.descripcionBody,
        horaFin: detail.horaFin,
        horaIni: detail.horaIni,
        idAutor: detail.autores?.map((autor) => autor.idAutor).join(",") ?? "",
        sala: detail.sala,
        idIdioma: detail.idIdioma,
        tipoPrograma: detail.tipoPrograma,
      };
    }),
  };
}
