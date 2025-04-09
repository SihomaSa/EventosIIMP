import { useForm } from "react-hook-form";
import { ProgramForm } from "../types/ProgramForm";

function useProgramForm() {
  const form = useForm<ProgramForm>({
    defaultValues: {
      detalles: [
        {
          descripcionBody: "",
          horaFin: "",
          horaIni: "",
          // idAutor: "",
          // sala: "",
          // idIdioma: NaN,
          // tipoPrograma: NaN,
        },
      ],
    },
  });

  return form;
}

export default useProgramForm;
