import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LanguageType } from "@/types/languageTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { useState } from "react";
import {
  CalendarIcon,
  Clock,
  Loader2,
  MapPin,
  User,
  Languages,
  Info,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useEventStore } from "@/stores/eventStore";
import { ActivityDetail } from "../../types/activityTypes";
import { Calendar } from "../ui/calendar";
import { updateActivityDetail } from "../services/activitiesServicec";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TimePicker } from "@/components/TimePicker";

interface EditActivityDetailModalProps {
  activityDetail: ActivityDetail;
  onSave: () => void;
  onClose: () => void;
}

export default function EditActivityDetailModal({
  activityDetail,
  onSave,
  onClose,
}: EditActivityDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedEvent } = useEventStore();
  const [open, setOpen] = useState(true);
  const [fechaIniOpen, setFechaIniOpen] = useState(false);
  const [fechaFinOpen, setFechaFinOpen] = useState(false);

  // Get the date part of the activity (needed for TimePicker)
  const getActivityDate = (): string => {
    if (activityDetail.fechaIni) {
      return activityDetail.fechaIni.split("T")[0];
    }
    if (activityDetail.horaIni && activityDetail.horaIni.includes("T")) {
      return activityDetail.horaIni.split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  };

  // Extract idIdioma or use prefijoIdioma to determine language
  const getLanguage = (): "1" | "2" => {
    if (activityDetail.idIdioma === "1") return "1";
    if (activityDetail.idIdioma === "2") return "2";
    if (activityDetail.prefijoIdioma === "EN") return "1";
    if (activityDetail.prefijoIdioma === "SP") return "2";
    return "2";
  };

  // Create a dynamic schema based on the activity fields
  const createSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    if (activityDetail.titulo !== undefined) {
      schemaFields.titulo = z
        .string()
        .min(3, "El título es requerido y debe tener al menos 3 caracteres");
    }

    if (
      activityDetail.responsable !== undefined &&
      activityDetail.responsable !== null
    ) {
      schemaFields.responsable = z
        .string()
        .min(2, "El responsable es requerido");
    }

    if (activityDetail.lugar !== undefined && activityDetail.lugar !== null) {
      schemaFields.lugar = z.string().min(2, "El lugar es requerido");
    }

    if (
      activityDetail.fechaIni !== undefined &&
      activityDetail.fechaIni !== null
    ) {
      schemaFields.fechaIni = z
        .string()
        .min(1, "La fecha de inicio es requerida");
    }

    if (
      activityDetail.fechaFin !== undefined &&
      activityDetail.fechaFin !== null
    ) {
      schemaFields.fechaFin = z
        .string()
        .min(1, "La fecha de finalización es requerida");
    }

    if (activityDetail.horaIni !== undefined) {
      schemaFields.horaIni = z
        .string()
        .min(1, "La hora de inicio es requerida");
    }

    if (activityDetail.horaFin !== undefined) {
      schemaFields.horaFin = z
        .string()
        .min(1, "La hora de finalización es requerida");
    }

    if (
      activityDetail.duracion !== undefined &&
      activityDetail.duracion !== null
    ) {
      schemaFields.duracion = z.string().min(1, "La duración es requerida");
    }

    return z.object(schemaFields);
  };

  const schema = createSchema();
  type FormData = z.infer<typeof schema>;

  const defaultValues: Partial<FormData> = {
    titulo: activityDetail.titulo || "",
    responsable: activityDetail.responsable || "",
    lugar: activityDetail.lugar || "",
    fechaIni: activityDetail.fechaIni || "",
    fechaFin: activityDetail.fechaFin || "",
    horaIni: activityDetail.horaIni || "",
    horaFin: activityDetail.horaFin || "",
    duracion: activityDetail.duracion || "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const fieldIcons: Record<string, React.ReactNode> = {
    titulo: <Info size={16} className="text-primary" />,
    responsable: <User size={16} className="text-primary" />,
    fechaIni: <CalendarIcon size={16} className="text-primary" />,
    fechaFin: <CalendarIcon size={16} className="text-primary" />,
    horaIni: <Clock size={16} className="text-primary" />,
    horaFin: <Clock size={16} className="text-primary" />,
    lugar: <MapPin size={16} className="text-primary" />,
    duracion: <Clock size={16} className="text-primary" />,
  };

  const fieldNames: Record<string, string> = {
    titulo: "Título",
    responsable: "Responsable",
    fechaIni: "Fecha de inicio",
    fechaFin: "Fecha de finalización",
    horaIni: "Hora de inicio",
    horaFin: "Hora de finalización",
    lugar: "Lugar",
    duracion: "Duración",
  };

  const formatLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12);
    return format(date, "PPP", { locale: es });
  };

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in days
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "1 día";
    if (diffDays === 1) return "1 día";
    return `${diffDays} días`;
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedEvent) return;

    try {
      setLoading(true);
      setError(null);

      const updatedActivity = {
        ...activityDetail,
        ...data,
        idIdioma: getLanguage() as LanguageType,
      };

      await updateActivityDetail(activityDetail.idActividad, updatedActivity);

      toast("✅ La actividad ha sido actualizada satisfactoriamente");
      onSave();
      setOpen(false);
    } catch (error) {
      console.error("Error al actualizar la actividad:", error);
      setError("Error al actualizar la actividad");
      toast("❌ Error al actualizar la actividad");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md md:max-w-2xl w-full flex flex-col max-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            Editar Actividad:{" "}
            {activityDetail.titulo || activityDetail.desTipoActividad}
          </DialogTitle>
          <DialogDescription>
            Actualice los campos de la actividad.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-2 mb-4">
          <form id="edit-activity-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Language indicator */}
            <div className="flex items-center mb-4 p-2 bg-gray-100 rounded-md">
              <div className="flex items-center gap-2">
                <Languages size={16} className="text-primary" />
                <span className="text-sm font-medium">
                  {getLanguage() === "1" ? "English" : "Español"}
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-2 bg-red-50 rounded-md text-xs text-red-500 flex items-center">
                <AlertCircle size={14} className="text-red-500 mr-2" />
                {error}
              </div>
            )}

            {/* Required fields explanation */}
            <div className="mb-4 p-2 bg-gray-50 rounded-md text-xs text-gray-500 flex items-center">
              <AlertCircle size={14} className="text-primary mr-2" />
              Todos los campos son obligatorios
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Título */}
              {activityDetail.titulo !== undefined && (
                <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="titulo"
                      className="flex items-center text-sm font-medium"
                    >
                      {fieldIcons.titulo}
                      <span className="ml-2">{fieldNames.titulo}</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="titulo"
                      type="text"
                      placeholder="Ingrese título"
                      {...register("titulo")}
                      className={cn(
                        "w-full",
                        errors.titulo && "border-red-500 focus:ring-red-500"
                      )}
                    />
                    {errors.titulo && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.titulo.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Responsable */}
              {activityDetail.responsable !== undefined &&
                activityDetail.responsable !== null && (
                  <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                    <div className="flex flex-col space-y-2">
                      <Label
                        htmlFor="responsable"
                        className="flex items-center text-sm font-medium"
                      >
                        {fieldIcons.responsable}
                        <span className="ml-2">{fieldNames.responsable}</span>
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="responsable"
                        type="text"
                        placeholder="Ingrese responsable"
                        {...register("responsable")}
                        className={cn(
                          "w-full",
                          errors.responsable &&
                            "border-red-500 focus:ring-red-500"
                        )}
                      />
                      {errors.responsable && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.responsable.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {/* Lugar */}
              {activityDetail.lugar !== undefined &&
                activityDetail.lugar !== null && (
                  <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                    <div className="flex flex-col space-y-2">
                      <Label
                        htmlFor="lugar"
                        className="flex items-center text-sm font-medium"
                      >
                        {fieldIcons.lugar}
                        <span className="ml-2">{fieldNames.lugar}</span>
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="lugar"
                        type="text"
                        placeholder="Ingrese lugar"
                        {...register("lugar")}
                        className={cn(
                          "w-full",
                          errors.lugar && "border-red-500 focus:ring-red-500"
                        )}
                      />
                      {errors.lugar && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.lugar.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              <div className="flex gap-4">
                {/* Fecha Inicio */}
                {activityDetail.fechaIni !== undefined &&
                  activityDetail.fechaIni !== null && (
                    <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200 w-full">
                      <div className="flex flex-col space-y-2">
                        <Label
                          htmlFor="fechaIni"
                          className="flex items-center text-sm font-medium"
                        >
                          {fieldIcons.fechaIni}
                          <span className="ml-2">{fieldNames.fechaIni}</span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Popover
                          open={fechaIniOpen}
                          onOpenChange={setFechaIniOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              id="fechaIni"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !watch("fechaIni") && "text-muted-foreground",
                                errors.fechaIni && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {watch("fechaIni") ? (
                                formatLocalDate(watch("fechaIni"))
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                watch("fechaIni")
                                  ? new Date(`${watch("fechaIni")}T12:00:00`)
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const isoDate = format(date, "yyyy-MM-dd");
                                  setValue("fechaIni", isoDate, {
                                    shouldValidate: true,
                                  });
                                  setFechaIniOpen(false);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.fechaIni && (
                          <p className="text-red-500 text-xs flex items-center mt-1">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.fechaIni.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Fecha Fin */}
                {activityDetail.fechaFin !== undefined &&
                  activityDetail.fechaFin !== null && (
                    <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200 w-full">
                      <div className="flex flex-col space-y-2">
                        <Label
                          htmlFor="fechaFin"
                          className="flex items-center text-sm font-medium"
                        >
                          {fieldIcons.fechaFin}
                          <span className="ml-2">{fieldNames.fechaFin}</span>
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Popover
                          open={fechaFinOpen}
                          onOpenChange={setFechaFinOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              id="fechaFin"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !watch("fechaFin") && "text-muted-foreground",
                                errors.fechaFin && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {watch("fechaFin") ? (
                                formatLocalDate(watch("fechaFin"))
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                watch("fechaFin")
                                  ? new Date(`${watch("fechaFin")}T12:00:00`)
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const isoDate = format(date, "yyyy-MM-dd");
                                  setValue("fechaFin", isoDate, {
                                    shouldValidate: true,
                                  });
                                  setFechaFinOpen(false);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.fechaFin && (
                          <p className="text-red-500 text-xs flex items-center mt-1">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.fechaFin.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
              {/* Duration info panel */}
              {activityDetail.fechaIni && activityDetail.fechaFin && (
                <div className="p-3 border-l-4 border-primary bg-primary/5 rounded-md mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <p className="text-sm">
                      <span className="font-medium">Duración del viaje:</span>{" "}
                      {calculateDuration(watch("fechaIni"), watch("fechaFin"))}
                    </p>
                  </div>
                </div>
              )}

              {/* Hora Inicio */}
              {activityDetail.horaIni !== undefined && (
                <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="horaIni"
                      className="flex items-center text-sm font-medium"
                    >
                      {fieldIcons.horaIni}
                      <span className="ml-2">{fieldNames.horaIni}</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <TimePicker
                      id="horaIni"
                      fechaActividad={getActivityDate()}
                      value={watch("horaIni") || ""}
                      onChange={(value: string) =>
                        setValue("horaIni", value, {
                          shouldValidate: true,
                        })
                      }
                      error={errors.horaIni?.message?.toString()}
                    />
                  </div>
                </div>
              )}

              {/* Hora Fin */}
              {activityDetail.horaFin !== undefined && (
                <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="horaFin"
                      className="flex items-center text-sm font-medium"
                    >
                      {fieldIcons.horaFin}
                      <span className="ml-2">{fieldNames.horaFin}</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <TimePicker
                      id="horaFin"
                      fechaActividad={getActivityDate()}
                      value={watch("horaFin") || ""}
                      onChange={(value: string) =>
                        setValue("horaFin", value, {
                          shouldValidate: true,
                        })
                      }
                      error={errors.horaFin?.message?.toString()}
                    />
                  </div>
                </div>
              )}

              {/* Duración */}
              {activityDetail.duracion !== undefined &&
                activityDetail.duracion !== null && (
                  <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                    <div className="flex flex-col space-y-2">
                      <Label
                        htmlFor="duracion"
                        className="flex items-center text-sm font-medium"
                      >
                        {fieldIcons.duracion}
                        <span className="ml-2">{fieldNames.duracion}</span>
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="duracion"
                        type="text"
                        placeholder="Ingrese duración"
                        {...register("duracion")}
                        className={cn(
                          "w-full",
                          errors.duracion && "border-red-500 focus:ring-red-500"
                        )}
                      />
                      {errors.duracion && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.duracion.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </form>
        </div>

        {/* Fixed footer */}
        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-auto justify-between">
          <Button variant="outline" onClick={handleDialogClose} type="button">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="edit-activity-form"
            disabled={loading}
            className="bg-primary"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
