import { z, ZodType } from "zod";
import { ActivityTypeMap } from "../types/activityTypes";

const idIdiomaSchema = z.string();
const fieldTripSchema = z.object({
	responsable: z.string().min(1),
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

const othersSchema = z.object({
	titulo: z.string().min(1),
	horaIni: z.string().min(1),
	horaFin: z.string().min(1),
	responsable: z.string().min(1),
	idIdioma: idIdiomaSchema,
});

const lunchSchema = coffeeBreakSchema;
const ribbonCuttingSchema = closingSchema;
const congressInaugurationSchema = closingSchema;
const gratitudeDinnerSchema = coffeeBreakSchema;

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
): z.ZodType<
	Omit<ActivityTypeMap[T], "fechaActividad" | "idEvento" | "idTipoActividad">
> {
	return activitySchemas[id] as unknown as ZodType<
		Omit<ActivityTypeMap[T], "fechaActividad" | "idEvento" | "idTipoActividad">
	>;
}
