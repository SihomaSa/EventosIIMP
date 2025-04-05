import { z, ZodType } from "zod";
import {
  ActivityTypeMap,
} from "../types/activityTypes";

import { LanguageType } from "../types/languageTypes";

const idIdiomaSchema = z.string()
;

const fieldTripSchema = z.object({
  responsable: z.string().min(1),
  duracion: z.string().optional(),
  titulo: z.string().min(1),
  fechaIni: z.string().min(1),
  fechaFin: z.string().min(1),
  horaIni: z.string().min(1),
  horaFin: z.string().min(1),
  idIdioma: idIdiomaSchema,
});

const courseSchema = z.object({
  titulo: z.string().min(1),
  responsable: z.string().min(1),
  traduccion: z.string().min(1),
  horaIni: z.string().min(1),
  horaFin: z.string().min(1),
  idIdioma: idIdiomaSchema,
  lugar: z.string().min(1),
});

const coffeeBreakSchema = z.object({
  titulo: z.string().min(1),
  horaIni: z.string().min(1),
  horaFin: z.string().min(1),
  idIdioma: idIdiomaSchema,
});

const closingSchema = z.object({
  titulo: z.string().min(1),
  horaIni: z.string().min(1),
  horaFin: z.string().min(1),
  lugar: z.string().min(1),
  idIdioma: idIdiomaSchema,
});

const lunchSchema = coffeeBreakSchema;
const ribbonCuttingSchema = closingSchema;
const othersSchema = coffeeBreakSchema;
const congressInaugurationSchema = closingSchema;
const gratitudeDinnerSchema = closingSchema;

export const activitySchemas = {
  1: fieldTripSchema,
  2: courseSchema,
  3: coffeeBreakSchema,
  4: lunchSchema,
  5: ribbonCuttingSchema,
  6: closingSchema,
  7: othersSchema,
  8: congressInaugurationSchema,
  9: gratitudeDinnerSchema,
} as const;

export function getActivitySchema<T extends keyof ActivityTypeMap>(
  id: T
): z.ZodType<Omit<ActivityTypeMap[T], "fechaActividad" | "idEvento" | "idTipoActividad">> {
  return activitySchemas[id] as unknown as ZodType<Omit<ActivityTypeMap[T], "fechaActividad" | "idEvento" | "idTipoActividad">>;

}

// const activitySchemas: {
//   1: ActivitySchemaType<Omit<NewFieldTripRequest, keyof BaseActivityRequestType>>;
//   2: ActivitySchemaType<Omit<NewCourseRequest, keyof BaseActivityRequestType>>;
//   3: ActivitySchemaType<Omit<NewCoffeeBreakRequest, keyof BaseActivityRequestType>>;
//   4: ActivitySchemaType<Omit<NewLunchRequest, keyof BaseActivityRequestType>>;
//   5: ActivitySchemaType<Omit<NewExhibitionRibbonCuttingRequest, keyof BaseActivityRequestType>>;
//   6: ActivitySchemaType<Omit<NewClosingRequest, keyof BaseActivityRequestType>>;
//   7: ActivitySchemaType<Omit<NewOthersRequest, keyof BaseActivityRequestType>>;
//   8: ActivitySchemaType<Omit<NewCongressInaugurationRequest, keyof BaseActivityRequestType>>;
//   9: ActivitySchemaType<Omit<NewGratitudDinnerRequest, keyof BaseActivityRequestType>>;
// } = {
//   1: z.object({
//     ...commonFields,
//     responsable: z.string().min(1, { message: "Responsable es requerido" }),
//     duracion: z.string().min(1, { message: "Responsable es requerido" }),
//     fechaFin: z.string().min(1, { message: "Fecha fin es requerida" }),
//     fechaIni: z.string().min(1, { message: "Fecha inicio es requerida" }),
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//   }), // Viaje de Campo
//   2: z.object({
//     ...commonFields,
//     responsable: z.string().min(1, { message: "Responsable es requerido" }),
//     traduccion: z.string().min(1, { message: "Responsable es requerido" }),
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//     lugar: z.string().min(1, { message: "Lugar es requerido" }),
//   }), // Curso Corto
//   3:z.object({
//     ...commonFields,
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//   }),  // Pausa Café
//   4: z.object({
//     ...commonFields,
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//   }), // Almuerzo
//   5: z.object({
//     ...commonFields,
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//     lugar: z.string().min(1, { message: "Lugar es requerido" }),
//   }), // Corte de Cinta de Exhibición
//   6: z.object({
//     ...commonFields,
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//     lugar: z.string().min(1, { message: "Lugar es requerido" }),
//   }), // Clausura
//   7: z.object({
//     ...commonFields,
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//   }), // Otros
//   8: z.object({
//     ...commonFields,
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//     lugar: z.string().min(1, { message: "Lugar es requerido" }),
//   }), // Inauguración del Congreso
//   9: z.object({
//     ...commonFields,
//     horaFin: z.string().min(1, { message: "Hora fin es requerida" }),
//     horaIni: z.string().min(1, { message: "Hora inicio es requerida" }),
//     lugar: z.string().min(1, { message: "Lugar es requerido" }),
//   }), // Cena de Agradecimiento
// };

// export const getActivitySchema = (idTipoActividad?: number): z.ZodObject<any> => {
//   const defaultActivityId = 1;
//   const activityId = (idTipoActividad ?? defaultActivityId) as keyof typeof activitySchemas;

//   return baseSchema.merge(activitySchemas[activityId]);
// };