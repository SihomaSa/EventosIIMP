import { useForm } from "react-hook-form";
import { ProgramForm } from "../types/ProgramForm";

const defaultValue: Partial<ProgramForm> = {
  fechaPrograma: new Date().toISOString().slice(0, 10),
  detalles: [
    {
      descripcionBody: "",
      horaFin: "",
      horaIni: "",
    },
  ],
};

function useProgramForm(initialValue?: ProgramForm) {
  const form = useForm<ProgramForm>({
    defaultValues: initialValue ? initialValue : defaultValue,
  });
  return form;
}

export default useProgramForm;
