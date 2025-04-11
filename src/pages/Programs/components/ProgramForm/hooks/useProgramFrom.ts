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
  // fechaPrograma: "2025-05-05",
  // detalles: [
  //   {
  //     descripcionBody: "TEST",
  //     horaFin: "14:20",
  //     horaIni: "11:20",
  //     tipoPrograma: 1,
  //     idIdioma: 1,
  //   },
  //   {
  //     horaFin: "22:00",
  //     horaIni: "19:00",
  //     tipoPrograma: 3,
  //     descripcionBody: "TEST2",
  //     sala: "TEST2",
  //     idIdioma: 3,
  //   },
  // ],
  // descripcionPro: "TEST",
};

function useProgramForm(initialValue?: ProgramForm) {
  const form = useForm<ProgramForm>({
    defaultValues: initialValue ? initialValue : defaultValue,
  });
  return form;
}

export default useProgramForm;
