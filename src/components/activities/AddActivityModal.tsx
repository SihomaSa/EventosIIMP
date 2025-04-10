import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LanguageType } from "@/types/languageTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  Clock,
  Loader2,
  MapPin,
  Plus,
  User,
  Languages,
  Info,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useEventStore } from "@/stores/eventStore";
import {
  ActivityType,
  NewClosingRequest,
  NewCoffeeBreakRequest,
  NewCongressInaugurationRequest,
  NewCourseRequest,
  NewExhibitionRibbonCuttingRequest,
  NewFieldTripRequest,
  NewGratitudDinnerRequest,
  NewLunchRequest,
  NewMagisterialConferenceRequest,
  NewOthersRequest,
  NewRoundTableRequest,
} from "../../types/activityTypes";
import { Calendar } from "../ui/calendar";
import {
  createActivityDetail,
  getActivityTypes,
} from "../services/activitiesServicec";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TimePicker } from "@/components/TimePicker";
import { ActivityDay } from "@/types/activityTypes";

interface AddActivityModalProps {
  activity: ActivityDay;
  onAdd: () => void;
  onClose: () => void;
}

export default function AddActivityModal({
  activity,
  onAdd,
}: AddActivityModalProps) {
  const { fechaActividad } = activity;
  const [activityTypes, setActivityTypes] = useState<ActivityType[] | []>([]);
  const { selectedEvent } = useEventStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"1" | "2">("2"); // Default to Spanish (2)
  // Field configuration for each activity type
  const fieldsByActivityType: Record<number, string[]> = {
    1: ["titulo", "responsable", "fechaIni", "fechaFin", "horaIni", "horaFin"], // Viaje de Campo
    2: ["titulo", "responsable", "traduccion", "horaIni", "horaFin", "lugar"], // Curso Corto
    3: ["titulo", "horaIni", "horaFin"], // Pausa Café
    4: ["titulo", "horaIni", "horaFin"], // Almuerzo
    5: ["titulo", "horaIni", "horaFin", "lugar"], // Corte de Cinta de Exhibición
    6: ["titulo", "horaIni", "horaFin", "lugar"], // Clausura
    7: ["titulo", "horaIni", "horaFin", "responsable"], // Otros
    8: ["titulo", "horaIni", "horaFin", "lugar"], // Inauguración del Congreso
    9: ["titulo", "horaIni", "horaFin"], // Cena de Agradecimiento
    10: ["titulo", "horaIni", "horaFin"], // Conferencia Magistral
    11: ["titulo", "horaIni", "horaFin"], // Mesa Redonda
  };
  // Friendly field names for better UI labels
  const fieldNames: Record<string, string> = {
    titulo: "Título",
    responsable: "Responsable",
    fechaIni: "Fecha de inicio",
    fechaFin: "Fecha de finalización",
    horaIni: "Hora de inicio",
    horaFin: "Hora de finalización",
    lugar: "Lugar",
    traduccion: "Traducción",
  };
  // Field icons for visual cues
  const fieldIcons: Record<string, React.ReactNode> = {
    titulo: <Info size={16} className="text-primary" />,
    responsable: <User size={16} className="text-primary" />,
    fechaIni: <CalendarIcon size={16} className="text-primary" />,
    fechaFin: <CalendarIcon size={16} className="text-primary" />,
    horaIni: <Clock size={16} className="text-primary" />,
    horaFin: <Clock size={16} className="text-primary" />,
    lugar: <MapPin size={16} className="text-primary" />,
    traduccion: <Languages size={16} className="text-primary" />,
  };
  // Activity type names by language
  const activityTypeNames: Record<string, Record<string, string>> = {
    "1": {
      "1": "Field Trip",
      "2": "Viaje de Campo",
    },
    "2": {
      "1": "Short Course",
      "2": "Curso Corto",
    },
    "3": {
      "1": "Coffee Break",
      "2": "Pausa Café",
    },
    "4": {
      "1": "Lunch",
      "2": "Almuerzo",
    },
    "5": {
      "1": "Exhibition Ribbon Cutting",
      "2": "Corte de Cinta de Exhibición",
    },
    "6": {
      "1": "Closing",
      "2": "Clausura",
    },
    "7": {
      "1": "Others",
      "2": "Otros",
    },
    "8": {
      "1": "Congress Inauguration",
      "2": "Inauguración del Congreso",
    },
    "9": {
      "1": "Gratitude Dinner",
      "2": "Cena de Agradecimiento",
    },
    "10": {
      "1": "Magisterial Conference",
      "2": "Conferencia Magistral",
    },
    "11": {
      "1": "Round Table",
      "2": "Mesa Redonda",
    },
  };
  // Create a dynamic schema based on the selected activity type
  const createDynamicSchema = () => {
    if (!activityType) return z.object({});
    const fields = fieldsByActivityType[activityType] || [];
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    fields.forEach((field) => {
      if (field === "titulo") {
        schemaFields[field] = z
          .string()
          .min(3, "El título es requerido y debe tener al menos 3 caracteres");
      } else if (field === "responsable") {
        schemaFields[field] = z.string().min(2, "El responsable es requerido");
      } else if (field === "lugar") {
        schemaFields[field] = z.string().min(2, "El lugar es requerido");
      } else if (field === "traduccion") {
        schemaFields[field] = z.string().min(2, "La traducción es requerida");
      } else if (field.includes("fecha")) {
        schemaFields[field] = z.string().min(1, "La fecha es requerida");
      } else if (field.includes("hora")) {
        schemaFields[field] = z.string().min(1, "La hora es requerida");
      } else {
        schemaFields[field] = z.string().min(1, "Este campo es requerido");
      }
    });
    return z.object(schemaFields);
  };

  const schema = createDynamicSchema();
  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // Validate on change for immediate feedback
  });

  const handleSelectActivity = (value: number) => {
    setActivityType(value);
    reset(); // Reset form fields when activity type changes
  };
  useEffect(() => {
    (async () => {
      try {
        const data = await getActivityTypes();
        setActivityTypes(data);
      } catch (err) {
        setError("Error al obtener las categorías de actividades");
        console.log(err);
      } finally {
        setLoadingTypes(false);
      }
    })();
  }, []);
  const handleNext = () => {
    if (activityType) {
      setStep(2);
    } else {
      toast("Selecciona un tipo de actividad antes de continuar.");
    }
  };
  const handleBack = () => {
    setStep(1);
    reset();
    setActivityType(null);
  };
  // Type guards for different activity types
  function isFieldTripRequest(data: any): data is NewFieldTripRequest {
    return (
      typeof data.responsable === "string" &&
      typeof data.fechaIni === "string" &&
      typeof data.fechaFin === "string"
    );
  }
  function isCourseRequest(data: any): data is NewCourseRequest {
    return (
      typeof data.responsable === "string" &&
      typeof data.traduccion === "string" &&
      typeof data.lugar === "string"
    );
  }
  function isExhibitionRibbonCuttingRequest(
    data: any
  ): data is NewExhibitionRibbonCuttingRequest {
    return typeof data.lugar === "string";
  }
  function isCoffeeBreakRequest(data: any): data is NewCoffeeBreakRequest {
    return typeof data.titulo === "string";
  }
  function isLunchRequest(data: any): data is NewLunchRequest {
    return typeof data.titulo === "string";
  }
  function isClosingRequest(data: any): data is NewClosingRequest {
    return typeof data.lugar === "string";
  }
  function isOthersRequest(data: any): data is NewOthersRequest {
    return typeof data.responsable === "string";
  }
  function isCongressInaugurationRequest(
    data: any
  ): data is NewCongressInaugurationRequest {
    return typeof data.lugar === "string";
  }
  function isGratitudDinnerRequest(
    data: any
  ): data is NewGratitudDinnerRequest {
    return typeof data.titulo === "string";
  }
  function isMagisterialConferenceRequest(
    data: any
  ): data is NewMagisterialConferenceRequest {
    return typeof data.titulo === "string";
  }
  function isRoundTableRequest(data: any): data is NewRoundTableRequest {
    return typeof data.titulo === "string";
  }
  const onSubmit = async (data: FormData) => {
    if (!selectedEvent || !activityType) return;
    try {
      setLoading(true);
      let detalles;
      if (activityType === 1 && isFieldTripRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
          responsable: data.responsable,
          fechaIni: data.fechaIni,
          fechaFin: data.fechaFin,
        };
      } else if (activityType === 2 && isCourseRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
          responsable: data.responsable,
          traduccion: data.traduccion,
          lugar: data.lugar,
        };
      } else if (activityType === 3 && isCoffeeBreakRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
        };
      } else if (activityType === 4 && isLunchRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
        };
      } else if (activityType === 5 && isExhibitionRibbonCuttingRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
          lugar: data.lugar,
        };
      } else if (activityType === 6 && isClosingRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
          lugar: data.lugar,
        };
      } else if (activityType === 7 && isOthersRequest(data)) {
        detalles = {
          titulo: data.titulo,
          responsable: data.responsable,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
        };
      } else if (activityType === 8 && isCongressInaugurationRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
          lugar: data.lugar,
        };
      } else if (activityType === 9 && isGratitudDinnerRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
        };
      } else if (activityType === 10 && isMagisterialConferenceRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
        };
      } else if (activityType === 11 && isRoundTableRequest(data)) {
        detalles = {
          titulo: data.titulo,
          horaIni: data.horaIni,
          horaFin: data.horaFin,
          idIdioma: selectedLanguage as LanguageType,
        };
      }
      if (detalles) {
        const newActivityDet = [
          {
            fechaActividad: fechaActividad,
            idEvento: selectedEvent.idEvent,
            idTipoActividad: activityType,
            detalles: [detalles],
          },
        ];
        await createActivityDetail(newActivityDet);
        toast("✅ La actividad ha sido creada satisfactoriamente");
        setActivityType(null);
        setStep(1);
        onAdd();
        reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error al solicitar creación de actividad", error);
      toast("❌ Error al crear la actividad");
    } finally {
      setLoading(false);
    }
  };
  // Get current activity type name based on language
  const getCurrentActivityTypeName = () => {
    if (!activityType) return "";
    // Try to get name from the mapping
    if (activityTypeNames[activityType]?.[selectedLanguage]) {
      return activityTypeNames[activityType][selectedLanguage].toUpperCase();
    }
    // Fallback to data from API
    const foundType = activityTypes.find(
      (type) => type.idTipoActividad === activityType
    );
    return foundType?.des_actividad.toUpperCase() || "";
  };
  // Language selector component
  const renderLanguageSelector = () => (
    <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Languages size={20} className="text-primary" />
          <Label className="font-medium">Idioma / Language</Label>
        </div>
      </div>
      <div className="flex items-center space-x-8 mt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="language-en"
            checked={selectedLanguage === "1"}
            onCheckedChange={() => setSelectedLanguage("1")}
          />
          <Label htmlFor="language-en" className="cursor-pointer">
            English
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="language-es"
            checked={selectedLanguage === "2"}
            onCheckedChange={() => setSelectedLanguage("2")}
          />
          <Label htmlFor="language-es" className="cursor-pointer">
            Español
          </Label>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        {selectedLanguage === "1"
          ? "Only English activities will be displayed and created"
          : "Solo se mostrarán y crearán actividades en Español"}
      </p>
    </div>
  );
  return (
    <div className="flex flex-col gap-y-4 mb-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="text-primary rounded-lg p-3 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow transition-all duration-200 hover:bg-primary/5 h-full">
            <Plus size={24} className="mb-1" />
            <h3 className="text-sm font-medium">Agregar Actividad</h3>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md md:max-w-2xl w-full flex flex-col max-h-[90vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {step === 1
                ? "Selecciona el Tipo de Actividad"
                : `Agregar Actividad: ${getCurrentActivityTypeName()}`}
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Elige un tipo de actividad antes de continuar."
                : "Llena los campos para crear una nueva actividad."}
            </DialogDescription>
          </DialogHeader>
          {step === 1 ? (
            <>
              <div className="overflow-y-auto flex-grow pr-2 mb-4">
                {/* Language selector in step 1 */}
                {renderLanguageSelector()}
                {/* Activity type grid with smaller buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activityTypes.map((option) => {
                    // Only display activity types that have a name in the selected language
                    const activityName =
                      activityTypeNames[option.idTipoActividad]?.[
                        selectedLanguage
                      ];
                    if (!activityName) return null;
                    return (
                      <Button
                        key={option.idTipoActividad}
                        variant={
                          activityType === option.idTipoActividad
                            ? "default"
                            : "outline"
                        }
                        className={cn(
                          "text-xs sm:text-sm py-2 px-2 h-auto text-center break-words",
                          activityType === option.idTipoActividad
                            ? "bg-primary text-white"
                            : "hover:bg-primary/10"
                        )}
                        onClick={() => {
                          handleSelectActivity(option.idTipoActividad);
                        }}
                      >
                        {activityName.toUpperCase()}
                      </Button>
                    );
                  })}
                </div>
                {loadingTypes && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="animate-spin inline-block mr-2" />
                    <span>Cargando tipos de actividad...</span>
                  </div>
                )}
              </div>
              {/* Fixed footer */}
              <DialogFooter className="flex-shrink-0 border-t pt-4 mt-auto">
                <Button
                  onClick={handleNext}
                  disabled={!activityType}
                  className="w-full"
                >
                  Siguiente
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="overflow-y-auto flex-grow pr-2 mb-4">
                <form id="activity-form" onSubmit={handleSubmit(onSubmit)}>
                  {/* Fixed language indicator in step 2 */}
                  <div className="flex items-center justify-between mb-4 p-2 bg-gray-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <Languages size={16} className="text-primary" />
                      <span className="text-sm font-medium">
                        {selectedLanguage === "1" ? "English" : "Español"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs"
                    >
                      Cambiar
                    </Button>
                  </div>
                  {/* Required fields explanation */}
                  <div className="mb-4 p-2 bg-gray-50 rounded-md text-xs text-gray-500 flex items-center">
                    <AlertCircle size={14} className="text-primary mr-2" />
                    Todos los campos son obligatorios
                  </div>
                  {/* Simple form without accordion */}
                  <div className="space-y-4">
                    {activityType &&
                      fieldsByActivityType[activityType]?.map((field) => (
                        <div
                          key={field}
                          className="p-3 border rounded-md hover:border-primary transition-colors duration-200"
                        >
                          <div className="flex flex-col space-y-2">
                            <Label
                              htmlFor={field}
                              className="flex items-center text-sm font-medium"
                            >
                              {fieldIcons[field]}
                              <span className="ml-2">{fieldNames[field]}</span>
                              <span className="text-red-500 ml-1">*</span>
                            </Label>

                            {field.includes("hora") ? (
                              // Use our custom TimePicker for time fields
                              <TimePicker
                                fechaActividad={fechaActividad}
                                id={field}
                                value={watch(field) || ""}
                                onChange={(value: string) =>
                                  setValue(field, value, {
                                    shouldValidate: true,
                                  })
                                }
                                error={errors[field]?.message?.toString()}
                              />
                            ) : field.includes("fecha") ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id={field}
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !(watch(field as keyof FormData)) && "text-muted-foreground",
                                      errors[field as keyof FormData] && "border-red-500"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {watch(field as keyof FormData) ? (
                                      format(
                                        new Date(String(watch(field as keyof FormData))),
                                        "PPP",
                                        { locale: es }
                                      )
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      watch(field as keyof FormData)
                                        ? new Date(String(watch(field as keyof FormData)))
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      if (date) {
                                        const isoDate = date
                                          .toISOString()
                                          .split("T")[0];
                                        setValue(field, isoDate, {
                                          shouldValidate: true,
                                        });
                                      }
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <Input
                                id={field}
                                type="text"
                                placeholder={`Ingrese ${fieldNames[
                                  field
                                ].toLowerCase()}`}
                                {...register(field)}
                                className={cn(
                                  "w-full",
                                  errors[field] &&
                                    "border-red-500 focus:ring-red-500"
                                )}
                              />
                            )}

                            {errors[field] && !field.includes("hora") && (
                              <p className="text-red-500 text-xs flex items-center mt-1">
                                <AlertCircle size={12} className="mr-1" />
                                {errors[field]?.message?.toString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </form>
              </div>

              {/* Fixed footer */}
              <DialogFooter className="flex-shrink-0 border-t pt-4 mt-auto justify-between">
                <Button variant="outline" onClick={handleBack} type="button">
                  Volver
                </Button>
                <Button type="submit" form="activity-form" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
