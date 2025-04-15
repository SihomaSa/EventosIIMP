import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getActivitySchema } from "@/schemas/activitySchemas";
import { ActivityTypeMap } from "@/types/activityTypes";

export function useDynamicActivityForm<T extends keyof ActivityTypeMap>(idTipoActividad: T): UseFormReturn<
  Omit<ActivityTypeMap[T], "idEvento" | "fechaActividad" | "idTipoActividad">
> {
  const schema = getActivitySchema(idTipoActividad);
  return useForm({
    resolver: zodResolver(schema),
  });
}
