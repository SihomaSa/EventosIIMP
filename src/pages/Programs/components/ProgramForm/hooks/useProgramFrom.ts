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

// TODO:
// const programSchema = z.object({
//   fechaPrograma: z.string(),
//   descripcionPro: z.string(),
//   idEvento: z.number(),
//   detalles: z.array(
//     z.object({
//       descripcionBody: z.string(),
//       idAutor: z.string(),
//       sala: z.string(),
//       horaIni: z.string(),
//       horaFin: z.string(),
//       idIdioma: z.number(),
//       tipoPrograma: z.number(),
//     })
//   ),
// });

// type ProgramFormZod = z.infer<typeof programSchema>;

function useProgramForm(initialValue?: ProgramForm) {
  const form = useForm<ProgramForm>({
    // resolver: zodResolver(programSchema),
    defaultValues: initialValue ? initialValue : defaultValue,
  });
  return form;
}

export default useProgramForm;
