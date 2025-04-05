import { z } from "zod";

export const baseSchema = z.object({
  foto: z.instanceof(File).optional(),
  url: z.string().url({ message: "Debe ser una URL válida" }),
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
  estado: z
    .number()
    .int()
    .min(0)
    .max(1, { message: "El estado debe ser inactivo o activo" }),
});
