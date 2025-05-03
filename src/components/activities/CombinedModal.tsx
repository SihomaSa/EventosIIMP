import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LanguageType } from "@/types/languageTypes";
import {ActivityDetail,ActivityType,NewFieldTripRequest,NewCourseRequest,NewCoffeeBreakRequest,
  NewLunchRequest,NewExhibitionRibbonCuttingRequest,NewClosingRequest,NewOthersRequest,NewCongressInaugurationRequest,
  NewGratitudDinnerRequest,NewMagisterialConferenceRequest,NewRoundTableRequest,ActivityTypeId,
} from "@/types/activityTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/TimePicker";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter} from "@/components/ui/dialog";
import { Popover,PopoverContent,PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon,Clock, Loader2,MapPin, User, Languages,Info,AlertCircle} from "lucide-react";
import { toast } from "sonner";
import { useEventStore } from "@/stores/eventStore";
import { cn } from "@/lib/utils";
import {createActivityDetail,getActivityTypes,updateActivityDetail} from "@/components/services/activitiesServicec";

const MODAL_MODES = {
  DATE_SELECT: "DATE_SELECT",
  ACTIVITY_ADD: "ACTIVITY_ADD",
  ACTIVITY_EDIT: "ACTIVITY_EDIT",
};

const FIELD_NAMES = {
  titulo: "Título",
  responsable: "Responsable",
  fechaIni: "Fecha de inicio",
  fechaFin: "Fecha de finalización",
  horaIni: "Hora de inicio",
  horaFin: "Hora de finalización",
  lugar: "Lugar",
  duracion: "Duración del viaje",
  traduccion: "Traducción",
  idioma: "Traducción",
};

const FIELD_ICONS = {
  titulo: <Info size={16} className="text-primary" />,
  responsable: <User size={16} className="text-primary" />,
  fechaIni: <CalendarIcon size={16} className="text-primary" />,
  fechaFin: <CalendarIcon size={16} className="text-primary" />,
  horaIni: <Clock size={16} className="text-primary" />,
  horaFin: <Clock size={16} className="text-primary" />,
  lugar: <MapPin size={16} className="text-primary" />,
  duracion: <Clock size={16} className="text-primary" />,
  traduccion: <Languages size={16} className="text-primary" />,
  idioma: <Languages size={16} className="text-primary" />,
};

const FIELDS_BY_ACTIVITY_TYPE: Record<ActivityTypeId, string[]> = {
  1: ["titulo", "responsable", "fechaIni", "fechaFin", "horaIni", "horaFin"],
  2: ["titulo", "responsable", "horaIni", "horaFin", "lugar", "traduccion"],
  3: ["titulo", "horaIni", "horaFin"],
  4: ["titulo", "horaIni", "horaFin"],
  5: ["titulo", "horaIni", "horaFin", "lugar"],
  6: ["titulo", "horaIni", "horaFin", "lugar"],
  7: ["titulo", "horaIni", "horaFin", "responsable"],
  8: ["titulo", "horaIni", "horaFin", "lugar"],
  9: ["titulo", "horaIni", "horaFin", "lugar"],
  10: ["titulo", "horaIni", "horaFin"],
  11: ["titulo", "horaIni", "horaFin"],
};

const ACTIVITY_TYPE_NAMES = {
  // Spanish (1-11)
  "1": "VIAJE DE CAMPO",
  "2": "CURSO CORTO",
  "3": "PAUSA CAFE",
  "4": "ALMUERZO",
  "5": "CORTE DE CINTA DE EXHIBICION",
  "6": "CLAUSURA",
  "7": "OTROS",
  "8": "INAUGURACIÓN DEL CONGRESO",
  "9": "CENA DE AGRADECIMIENTO",
  "10": "CONFERENCIA MAGISTRAL",
  "11": "MESA REDONDA",

  // English (12-22)
  "12": "FIELD TRIP",
  "13": "COURSE",
  "14": "COFFEE BREAK",
  "15": "LUNCH",
  "16": "RIBBON CUTTING",
  "17": "CLOSING",
  "18": "OTHERS",
  "19": "CONGRESS OPENING",
  "20": "THANK YOU DINNER",
  "21": "KEYNOTE CONFERENCE",
  "22": "ROUND TABLE",
};

interface CombinedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  selectedEvent?: { idEvent: string; des_event: string };
  existingDates?: string[];
  editActivity?: ActivityDetail;
  initialDate?: string;
}

const getLocalizedActivityTypeId = (baseTypeId: number, language: string) => {
  if (language === "1") {
    return baseTypeId + 11;
  }
  return baseTypeId;
};

export default memo(function CombinedModal({
  isOpen,
  onClose,
  onAdd,
  selectedEvent,
  existingDates = [],
  editActivity,
  initialDate,
}: CombinedModalProps) {
  const previousEditActivityRef = useRef<ActivityDetail | undefined>(undefined);
  const initialSetupDoneRef = useRef(false);
  const formPopulatedRef = useRef(false);
  const activityTypesLoadedRef = useRef(false);

  const getInitialMode = useCallback(() => {
    if (editActivity) return MODAL_MODES.ACTIVITY_EDIT;
    if (initialDate) return MODAL_MODES.ACTIVITY_ADD;
    return MODAL_MODES.DATE_SELECT;
  }, [editActivity, initialDate]);

  const [mode, setMode] = useState(() => getInitialMode());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDate || null
  );
  const [selectedLanguage, setSelectedLanguage] = useState<"1" | "2">("2");
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [activityType, setActivityType] = useState<ActivityTypeId | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedEvent: eventFromStore } = useEventStore();
    const currentEvent = selectedEvent || eventFromStore;
  const [fechaIniOpen, setFechaIniOpen] = useState(false);
  const [fechaFinOpen, setFechaFinOpen] = useState(false);

  const createDynamicSchema = useCallback(() => {
    if (!activityType) return z.object({ fechaIni: z.string().optional() });
    const fields = FIELDS_BY_ACTIVITY_TYPE[activityType] || [];
    const schemaFields: Record<string, z.ZodTypeAny> = {
      fechaIni: z.string().optional(),
    };

    fields.forEach((field) => {
      if (field === "titulo") {
        schemaFields[field] = z
          .string()
          .min(3, "El título es requerido y debe tener al menos 3 caracteres");
      } else if (field === "responsable") {
        schemaFields[field] = z.string().min(2, "El responsable es requerido");
      } else if (field === "lugar") {
        schemaFields[field] = z.string().min(2, "El lugar es requerido");
      } else if (field.includes("fecha")) {
        schemaFields[field] = z.string().min(1, "La fecha es requerida");
      } else if (field.includes("hora")) {
        schemaFields[field] = z.string().min(1, "La hora es requerida");
      } else {
        schemaFields[field] = z.string().min(1, "Este campo es requerido");
      }
    });

    return z.object(schemaFields);
  }, [activityType]);

  const schema = useMemo(() => createDynamicSchema(), [createDynamicSchema]);
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setStep(1);
      setError(null);
      setActivityType(null);
      setSelectedDate(initialDate || null);
      setMode(getInitialMode());
      initialSetupDoneRef.current = false;
      formPopulatedRef.current = false;
      previousEditActivityRef.current = undefined;
    }
  }, [isOpen, reset, initialDate, getInitialMode]);

  useEffect(() => {
    if (isOpen && !activityTypesLoadedRef.current) {
      const loadActivityTypes = async () => {
        try {
          setLoadingTypes(true);
          const data = await getActivityTypes();
          setActivityTypes(data);
          activityTypesLoadedRef.current = true;
        } catch (err) {
          setError("Error al obtener las categorías de actividades");
          console.error(err);
        } finally {
          setLoadingTypes(false);
        }
      };

      loadActivityTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !initialSetupDoneRef.current) {
      const currentMode = getInitialMode();
      let initialSelectedDate: string | null = null;

      setMode(currentMode);

      if (currentMode === MODAL_MODES.ACTIVITY_EDIT && editActivity) {
        const activityDateString = editActivity.fechaActividad;

        if (activityDateString) {
          try {
            const activityDate = new Date(activityDateString);
            if (!isNaN(activityDate.getTime())) {
              initialSelectedDate = format(activityDate, "yyyy-MM-dd");
            } else {
              console.warn(
                "editActivity.fechaActividad is an invalid date string:",
                activityDateString
              );
            }
          } catch (e) {
            console.error(
              "Error parsing editActivity.fechaActividad:",
              activityDateString,
              e
            );
          }
        } else {
          console.warn("editActivity.fechaActividad is missing or null.");
        }
      } else if (currentMode === MODAL_MODES.ACTIVITY_ADD) {
        initialSelectedDate = initialDate || null;
      }
      setSelectedDate(initialSelectedDate);

      initialSetupDoneRef.current = true;
    } else if (!isOpen) {
      initialSetupDoneRef.current = false;
      formPopulatedRef.current = false;
      previousEditActivityRef.current = undefined;
    }
  }, [isOpen, getInitialMode, initialDate, editActivity]);

  const formatTimeValue = (value: string | undefined | null): string => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
      return value.split("T")[1];
    }
    if (/^\d{2}:\d{2}$/.test(value)) {
      return value;
    }
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
      const dateTimeParts = value.split(" ");
      const timeParts = dateTimeParts[1].split(":");
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return format(date, "HH:mm");
      }
    } catch (e) {
      console.error("Failed to parse time value:", value, e);
    }

    return "";
  };

  const formatDateValue = useCallback((value: string | undefined | null): string => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return format(date, "yyyy-MM-dd");
      }
    } catch (e) {
      console.error("Failed to parse date value:", value, e);
    }
    return "";
  }, []);

  useEffect(() => {
    const setupEditMode = () => {
      if (currentEvent) {
        setValue("evento", String(currentEvent.idEvent));
      }
      if (
        isOpen &&
        mode === MODAL_MODES.ACTIVITY_EDIT &&
        editActivity &&
        activityTypesLoadedRef.current &&
        !formPopulatedRef.current &&
        previousEditActivityRef.current !== editActivity
      ) {
        const typeId = Number(editActivity.idTipoActividad);

        // Determine if it's an English activity (ID 12-22)
        const languageToSet = editActivity.idIdioma === "1" ? "1" : "2";
        let baseTypeId = typeId;

        if (typeId >= 12 && typeId <= 22) {
          // This is an English activity
          baseTypeId = typeId - 11;
        }

        // Set the language first
        setSelectedLanguage(languageToSet as "1" | "2");

        if (
          baseTypeId &&
          !isNaN(baseTypeId) &&
          FIELDS_BY_ACTIVITY_TYPE[baseTypeId as ActivityTypeId]
        ) {
          setActivityType(baseTypeId as ActivityTypeId);
          setStep(2);

          setTimeout(() => {
            if (
              editActivity &&
              FIELDS_BY_ACTIVITY_TYPE[baseTypeId as ActivityTypeId]
            ) {
              const fields =
                FIELDS_BY_ACTIVITY_TYPE[baseTypeId as ActivityTypeId];
              fields.forEach((field) => {
                if (
                  field === "traduccion" &&
                  !(field in editActivity) &&
                  "idioma" in editActivity
                ) {
                  const value = editActivity["idioma"];
                  setValue("traduccion", String(value || ""), {
                    shouldValidate: true,
                  });
                } else {
                  const rawValue = editActivity[field as keyof ActivityDetail];
                  const valueToSet = (() => {
                    if (rawValue !== undefined && rawValue !== null) {
                      if (field === "horaIni" || field === "horaFin") {
                        return formatTimeValue(String(rawValue)) || "";
                      } else if (field === "fechaIni" || field === "fechaFin") {
                        return formatDateValue(String(rawValue)) || "";
                      } else {
                        return String(rawValue);
                      }
                    }
                    return "";
                  })();
                  setValue(field as keyof FormData, valueToSet, {
                    shouldValidate: true,
                  });
                }
              });

              formPopulatedRef.current = true;
              previousEditActivityRef.current = editActivity;
            }
          }, 150);
        } else if (baseTypeId && !isNaN(baseTypeId)) {
          console.warn(`Fields for activity type ${baseTypeId} not found.`);
        } else {
          console.error(
            "Invalid or missing activity type ID in editActivity:",
            editActivity.idTipoActividad
          );
        }
      }
    };
    setupEditMode();
  }, [isOpen, mode, editActivity, setValue, formatDateValue,currentEvent]);

  const handleSelectActivity = useCallback(
    (value: number) => {
      if (value >= 1 && value <= 11) {
        setActivityType(value as ActivityTypeId);
        reset({}, { keepDefaultValues: true });
        formPopulatedRef.current = false;
      }
    },
    [reset]
  );

  const handleNext = useCallback(() => {
    if (activityType) {
      setStep(2);
    } else {
      toast("Selecciona un tipo de actividad antes de continuar.");
    }
  }, [activityType]);

  const handleBack = useCallback(() => {
    setStep(1);
    reset({}, { keepDefaultValues: true });
    formPopulatedRef.current = false;
  }, [reset]);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      const formattedDate = format(date, "yyyy-MM-dd");
      setSelectedDate(formattedDate);
      setMode(MODAL_MODES.ACTIVITY_ADD);
      setStep(1);
      setActivityType(null);
      reset();
      formPopulatedRef.current = false;
    },
    [reset]
  );

  const calculateDuration = useCallback(
    (startDate: string, endDate: string): string => {
      if (
        !startDate ||
        !endDate ||
        !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
      ) {
        console.warn(
          "Invalid input format for duration calculation:",
          startDate,
          endDate
        );
        return "Fechas inválidas";
      }
      try {
        const startUTC = new Date(`${startDate}T12:00:00Z`);
        const endUTC = new Date(`${endDate}T12:00:00Z`);

        if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
          console.warn("Invalid dates after parsing:", startDate, endDate);
          return "Fechas inválidas";
        }
        if (endUTC < startUTC) {
          return "Fecha final anterior a inicial";
        }

        const diffTime = endUTC.getTime() - startUTC.getTime();
        const msPerDay = 1000 * 60 * 60 * 24;

        const dayDifference = Math.round(diffTime / msPerDay);

        if (dayDifference === 0) {
          return "1 día";
        } else {
          const inclusiveDays = dayDifference;
          return `${inclusiveDays}`;
        }
      } catch (e) {
        console.error("Error calculating duration:", e);
        return "Error";
      }
    },
    []
  );

  const isFieldTripRequest = (data: unknown): data is NewFieldTripRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "responsable" in data &&
      typeof data.responsable === "string" &&
      "fechaIni" in data &&
      typeof data.fechaIni === "string" &&
      "fechaFin" in data &&
      typeof data.fechaFin === "string"
    );
  };

  const isCourseRequest = (data: unknown): data is NewCourseRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "responsable" in data &&
      typeof data.responsable === "string" &&
      "lugar" in data &&
      typeof data.lugar === "string" &&
      "traduccion" in data &&
      typeof data.traduccion === "string"
    );
  };

  const isExhibitionRibbonCuttingRequest = (
    data: unknown
  ): data is NewExhibitionRibbonCuttingRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "lugar" in data &&
      typeof data.lugar === "string"
    );
  };

  const isCoffeeBreakRequest = (
    data: unknown
  ): data is NewCoffeeBreakRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "titulo" in data &&
      typeof data.titulo === "string"
    );
  };

  const isLunchRequest = (data: unknown): data is NewLunchRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "titulo" in data &&
      typeof data.titulo === "string"
    );
  };

  const isClosingRequest = (data: unknown): data is NewClosingRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "lugar" in data &&
      typeof data.lugar === "string"
    );
  };

  const isOthersRequest = (data: unknown): data is NewOthersRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "responsable" in data &&
      typeof data.responsable === "string"
    );
  };

  const isCongressInaugurationRequest = (
    data: unknown
  ): data is NewCongressInaugurationRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "lugar" in data &&
      typeof data.lugar === "string"
    );
  };

  const isGratitudDinnerRequest = (
    data: unknown
  ): data is NewGratitudDinnerRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "titulo" in data &&
      typeof data.titulo === "string" &&
      "lugar" in data &&
      typeof data.lugar === "string"
    );
  };

  const isMagisterialConferenceRequest = (
    data: unknown
  ): data is NewMagisterialConferenceRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "titulo" in data &&
      typeof data.titulo === "string"
    );
  };

  const isRoundTableRequest = (data: unknown): data is NewRoundTableRequest => {
    return (
      typeof data === "object" &&
      data !== null &&
      "titulo" in data &&
      typeof data.titulo === "string"
    );
  };

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!currentEvent || !activityType) return;

      try {
        setLoading(true);

        const localizedActivityTypeId = getLocalizedActivityTypeId(
          activityType,
          selectedLanguage
        );

        let detalles: {
          titulo: string;
          horaIni?: string | null;
          horaFin?: string | null;
          idIdioma: LanguageType;
          desTipoActividad?: string;
          responsable?: string;
          fechaIni?: string;
          fechaFin?: string;
          duracion?: string;
          lugar?: string;
          traduccion?: string;
          idDetalleAct?: number;
        } = {
          titulo: (data as { titulo: string }).titulo,
          horaIni: (data as { horaIni?: string }).horaIni,
          horaFin: (data as { horaFin?: string }).horaFin,
          idIdioma: selectedLanguage as LanguageType,
        };

        detalles.desTipoActividad =
          ACTIVITY_TYPE_NAMES[
            localizedActivityTypeId.toString() as keyof typeof ACTIVITY_TYPE_NAMES
          ];

        if (activityType === 1 && isFieldTripRequest(data)) {
          const calculatedDuration = calculateDuration(
            data.fechaIni,
            data.fechaFin
          );
          detalles = {
            ...detalles,
            responsable: data.responsable,
            fechaIni: data.fechaIni,
            fechaFin: data.fechaFin,
            duracion: calculatedDuration,
          };
        } else if (activityType === 2 && isCourseRequest(data)) {
          detalles = {
            ...detalles,
            responsable: data.responsable,
            lugar: data.lugar,
            traduccion: data.traduccion,
          };
        } else if (activityType === 3 && isCoffeeBreakRequest(data)) {
          // Base details are sufficient
        } else if (activityType === 4 && isLunchRequest(data)) {
          // Base details are sufficient
        } else if (
          activityType === 5 &&
          isExhibitionRibbonCuttingRequest(data)
        ) {
          detalles = { ...detalles, lugar: data.lugar };
        } else if (activityType === 6 && isClosingRequest(data)) {
          detalles = { ...detalles, lugar: data.lugar };
        } else if (activityType === 7 && isOthersRequest(data)) {
          detalles = { ...detalles, responsable: data.responsable };
        } else if (activityType === 8 && isCongressInaugurationRequest(data)) {
          detalles = { ...detalles, lugar: data.lugar };
        } else if (activityType === 9 && isGratitudDinnerRequest(data)) {
          detalles = { ...detalles, lugar: data.lugar };
        } else if (
          activityType === 10 &&
          isMagisterialConferenceRequest(data)
        ) {
          // Base details are sufficient
        } else if (activityType === 11 && isRoundTableRequest(data)) {
          // Base details are sufficient
        } else {
          console.error(
            "Activity type mapping failed in onSubmit",
            activityType,
            data
          );
          throw new Error(
            "Tipo de actividad no coincide con los datos del formulario."
          );
        }

        if (mode === MODAL_MODES.ACTIVITY_EDIT && editActivity) {
          const formattedHoraIni = data.horaIni
            ? `${initialDate}T${data.horaIni}`
            : null;
          const formattedHoraFin = data.horaFin
            ? `${initialDate}T${data.horaFin}`
            : null;

          detalles.idDetalleAct = editActivity.idDetalleAct;

          detalles.horaIni = formattedHoraIni;
          detalles.horaFin = formattedHoraFin;

          await updateActivityDetail([
            {
              fechaActividad: initialDate,
              idEvento: currentEvent.idEvent,
              idTipoActividad: localizedActivityTypeId,
              idActividad: editActivity.idActividad,
              detalles: [detalles],
            },
          ] as Partial<ActivityDetail>);

          toast("✅ La actividad ha sido actualizada satisfactoriamente");
        } else if (mode === MODAL_MODES.ACTIVITY_ADD && selectedDate) {
          const newActivityDet = [
            {
              fechaActividad: selectedDate,
              idEvento: currentEvent.idEvent,
              idTipoActividad: localizedActivityTypeId,
              detalles: [detalles],
            },
          ];
          await createActivityDetail(newActivityDet);
          toast("✅ La actividad ha sido creada satisfactoriamente");
        } else {
          throw new Error("Modo de modal o fecha inválidos para guardar.");
        }

        onAdd();
        onClose();
      } catch (error) {
        console.error(
          mode === MODAL_MODES.ACTIVITY_EDIT
            ? "Error al actualizar actividad"
            : "Error al crear actividad",
          error
        );
        toast(
          mode === MODAL_MODES.ACTIVITY_EDIT
            ? "❌ Error al actualizar la actividad"
            : "❌ Error al crear la actividad"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      currentEvent,
      activityType,
      mode,
      editActivity,
      selectedDate,
      selectedLanguage,
      calculateDuration,
      onAdd,
      onClose,
      initialDate,
    ]
  );

  const getCurrentActivityTypeName = useMemo(() => {
    if (!activityType) return "";
    const localizedTypeId = getLocalizedActivityTypeId(
      activityType,
      selectedLanguage
    );

    const activityName =
      ACTIVITY_TYPE_NAMES[
        localizedTypeId.toString() as keyof typeof ACTIVITY_TYPE_NAMES
      ];

    if (activityName) return activityName.toUpperCase();

    const foundType = activityTypes.find(
      (type) => type.idTipoActividad === activityType
    );
    return foundType?.des_actividad?.toUpperCase() || "";
  }, [activityType, selectedLanguage, activityTypes]);

  const formatLocalDate = useCallback((dateString: string) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12);
    return format(date, "PPP", { locale: es });
  }, []);

  const renderLanguageSelector = useMemo(
    () => (
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
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedLanguage("1");
                  setActivityType(null);
                  reset();
                  formPopulatedRef.current = false;
                }
              }}
              disabled={mode === MODAL_MODES.ACTIVITY_EDIT}
            />
            <Label
              htmlFor="language-en"
              className={cn(
                "cursor-pointer",
                mode === MODAL_MODES.ACTIVITY_EDIT && "text-muted-foreground"
              )}
            >
              Inglés
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="language-es"
              checked={selectedLanguage === "2"}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedLanguage("2");
                  setActivityType(null);
                  reset();
                  formPopulatedRef.current = false;
                }
              }}
              disabled={mode === MODAL_MODES.ACTIVITY_EDIT}
            />
            <Label
              htmlFor="language-es"
              className={cn(
                "cursor-pointer",
                mode === MODAL_MODES.ACTIVITY_EDIT && "text-muted-foreground"
              )}
            >
              Español
            </Label>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {selectedLanguage === "1"
            ? "Only English activities will be displayed and created"
            : "Solo se mostrarán y crearán actividades en Español"}
          {mode === MODAL_MODES.ACTIVITY_EDIT &&
            " (El idioma no se puede cambiar al editar)"}
        </p>
      </div>
    ),
    [selectedLanguage, mode, reset]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (!existingDates || existingDates.length === 0) return false;
      const formattedDate = format(date, "yyyy-MM-dd");
      return existingDates.includes(formattedDate);
    },
    [existingDates]
  );

  const activityTypeButtons = useMemo(() => {
    if (!activityTypes.length) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {activityTypes.map((option) => {
          const baseTypeId = option.idTipoActividad;

          if (baseTypeId < 1 || baseTypeId > 11) return null;

          const activityName =
            ACTIVITY_TYPE_NAMES[
              getLocalizedActivityTypeId(
                baseTypeId,
                selectedLanguage
              ).toString() as keyof typeof ACTIVITY_TYPE_NAMES
            ];

          if (!activityName) return null;

          return (
            <Button
              key={baseTypeId}
              variant={activityType === baseTypeId ? "default" : "outline"}
              className={cn(
                "text-xs sm:text-sm py-2 px-2 h-auto text-center break-words whitespace-normal",
                activityType === baseTypeId
                  ? "bg-primary text-white"
                  : "hover:bg-primary/10",
                mode === MODAL_MODES.ACTIVITY_EDIT &&
                  activityType !== baseTypeId &&
                  "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (mode !== MODAL_MODES.ACTIVITY_EDIT) {
                  // Allow selection only if not editing
                  handleSelectActivity(baseTypeId);
                }
              }}
              disabled={mode === MODAL_MODES.ACTIVITY_EDIT}
            >
              {activityName.toUpperCase()}
            </Button>
          );
        })}
      </div>
    );
  }, [
    activityTypes,
    selectedLanguage,
    activityType,
    handleSelectActivity,
    mode,
  ]);

  const dateIndicator = useMemo(() => {
    const dateToShow =
      mode === MODAL_MODES.ACTIVITY_EDIT && editActivity
        ? editActivity.fechaActividad
        : selectedDate;
    if (!dateToShow) return null;

    return (
      <div className="flex items-center justify-between mb-4 p-3 bg-primary/10 rounded-md">
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-primary" />
          <span className="text-sm font-medium">
            {formatLocalDate(formatDateValue(dateToShow))}
          </span>
        </div>
      </div>
    );
  }, [mode, selectedDate, editActivity, formatLocalDate, formatDateValue]);

  const loadingIndicator = useMemo(() => {
    if (!loadingTypes) return null;

    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="animate-spin inline-block mr-2" />
        <span>Cargando tipos de actividad...</span>
      </div>
    );
  }, [loadingTypes]);

  const renderFormFields = useMemo(() => {
    if (!activityType || !FIELDS_BY_ACTIVITY_TYPE[activityType]) return null;
    const currentFields = FIELDS_BY_ACTIVITY_TYPE[activityType];

    return (
      <>
        {activityType === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Controller
              name="fechaIni"
              control={control}
              render={({ field: controllerField, fieldState }) => (
                <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="fechaIni-input"
                      className="flex items-center text-sm font-medium"
                    >
                      {FIELD_ICONS.fechaIni}
                      <span className="ml-2">{FIELD_NAMES.fechaIni}</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Popover open={fechaIniOpen} onOpenChange={setFechaIniOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="fechaIni-input"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !controllerField.value && "text-muted-foreground",
                            fieldState.error && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {controllerField.value ? (
                            formatLocalDate(controllerField.value)
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            controllerField.value
                              ? new Date(`${controllerField.value}T12:00:00`)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const isoDate = format(date, "yyyy-MM-dd");
                              controllerField.onChange(isoDate);
                              setFechaIniOpen(false);
                            } else {
                              controllerField.onChange("");
                              setFechaIniOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle size={12} className="mr-1" />
                        {fieldState.error?.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
            <Controller
              name="fechaFin"
              control={control}
              render={({ field: controllerField, fieldState }) => (
                <div className="p-3 border rounded-md hover:border-primary transition-colors duration-200">
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="fechaFin-input"
                      className="flex items-center text-sm font-medium"
                    >
                      {FIELD_ICONS.fechaFin}
                      <span className="ml-2">{FIELD_NAMES.fechaFin}</span>
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Popover open={fechaFinOpen} onOpenChange={setFechaFinOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="fechaFin-input"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !controllerField.value && "text-muted-foreground",
                            fieldState.error && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {controllerField.value ? (
                            formatLocalDate(controllerField.value)
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            controllerField.value
                              ? new Date(`${controllerField.value}T12:00:00`)
                              : undefined
                          }
                          disabled={(
                            date // Disable dates before fechaIni
                          ) =>
                            watch("fechaIni")
                              ? date < new Date(`${watch("fechaIni")}T00:00:00`)
                              : false
                          }
                          onSelect={(date) => {
                            if (date) {
                              const isoDate = format(date, "yyyy-MM-dd");
                              controllerField.onChange(isoDate);
                              setFechaFinOpen(false);
                            } else {
                              controllerField.onChange("");
                              setFechaFinOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle size={12} className="mr-1" />
                        {fieldState.error?.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {activityType === 1 && watch("fechaIni") && watch("fechaFin") && (
          <div className="p-3 border-l-4 border-primary bg-primary/5 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <p className="text-sm">
                <span className="font-medium">Duración del viaje:</span>{" "}
                {calculateDuration(watch("fechaIni"), watch("fechaFin")) +
                  " días"}
              </p>
            </div>
          </div>
        )}

        {currentFields.map((field) => {
          if (
            activityType === 1 &&
            (field === "fechaIni" || field === "fechaFin")
          ) {
            return null;
          }

          const isTimeField = field.includes("hora");
          const isStandardInput = !isTimeField; // Add other non-standard types if needed

          return (
            <div
              key={field}
              className="p-3 border rounded-md hover:border-primary transition-colors duration-200 mb-3"
            >
              {isTimeField ? (
                <Controller
                  name={field as keyof FormData}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <div className="flex flex-col space-y-2">
                      <Label
                        htmlFor={field}
                        className="flex items-center text-sm font-medium"
                      >
                        {FIELD_ICONS[field as keyof typeof FIELD_ICONS]}
                        <span className="ml-2">
                          {FIELD_NAMES[field as keyof typeof FIELD_NAMES]}
                        </span>
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <TimePicker
                        fechaActividad={selectedDate || ""}
                        id={field}
                        value={controllerField.value || ""}
                        onChange={controllerField.onChange}
                        error={fieldState.error?.message}
                      />
                    </div>
                  )}
                />
              ) : isStandardInput ? (
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor={field}
                    className="flex items-center text-sm font-medium"
                  >
                    {FIELD_ICONS[field as keyof typeof FIELD_ICONS]}
                    <span className="ml-2">
                      {FIELD_NAMES[field as keyof typeof FIELD_NAMES]}
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id={field}
                    type="text"
                    placeholder={`Ingrese ${FIELD_NAMES[
                      field as keyof typeof FIELD_NAMES
                    ].toLowerCase()}`}
                    {...register(field as keyof FormData)}
                    className={cn(
                      "w-full",
                      errors[field as keyof FormData] &&
                        "border-red-500 focus:ring-red-500"
                    )}
                  />
                  {errors[field as keyof FormData] && (
                    <p className="text-red-500 text-xs flex items-center mt-1">
                      <AlertCircle size={12} className="mr-1" />
                      {errors[field as keyof FormData]?.message?.toString()}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </>
    );
  }, [
    activityType,
    errors,
    control,
    register,
    watch,
    selectedDate,
    fechaIniOpen,
    fechaFinOpen,
    setFechaIniOpen,
    setFechaFinOpen,
    formatLocalDate,
    calculateDuration,
  ]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        } else if (
          mode === MODAL_MODES.ACTIVITY_EDIT &&
          !formPopulatedRef.current
        ) {
          // Logic to re-trigger setup if needed, handled by useEffect now
        }
      }}
    >
      <DialogContent className="max-w-md md:max-w-2xl w-full flex flex-col max-h-[90vh]">
        <DialogHeader className="flex-shrink-0 flex items-center justify-between">
          <div>
          <DialogTitle className="text-xl font-semibold flex items-center">
              {mode === MODAL_MODES.DATE_SELECT && "Agregar Nueva Fecha"}
              {mode === MODAL_MODES.ACTIVITY_ADD &&
                step === 1 &&
                "Selecciona el Tipo de Actividad"}
              {mode === MODAL_MODES.ACTIVITY_ADD &&
                step === 2 &&
                `Agregar Actividad: ${getCurrentActivityTypeName || "..."}`}
              {mode === MODAL_MODES.ACTIVITY_EDIT &&
                step === 1 &&
                "Editar Actividad"}
              {mode === MODAL_MODES.ACTIVITY_EDIT &&
                step === 2 &&
                `Editar Actividad: ${getCurrentActivityTypeName || "..."}`}
            </DialogTitle>
            <DialogDescription>
              {mode === MODAL_MODES.DATE_SELECT &&
                "Selecciona una fecha que no esté ya creada."}
              {mode === MODAL_MODES.ACTIVITY_ADD &&
                step === 1 &&
                "Elige un tipo de actividad antes de continuar."}
              {((mode === MODAL_MODES.ACTIVITY_ADD && step === 2) ||
                (mode === MODAL_MODES.ACTIVITY_EDIT && step === 2)) &&
                "Llena los campos para la actividad."}
              {mode === MODAL_MODES.ACTIVITY_EDIT &&
                step === 1 &&
                "Cargando detalles de la actividad..."}
            </DialogDescription>
          </div>
        </DialogHeader>
        {mode === MODAL_MODES.DATE_SELECT && (
          <div className="overflow-y-auto flex-grow pr-2 mb-4">
            <div className="py-6">
              <div className="mx-auto max-w-sm bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center items-center">
                <Calendar
                  mode="single"
                  selected={
                    selectedDate
                      ? new Date(`${selectedDate}T12:00:00`)
                      : undefined
                  }
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  initialFocus
                  className="mx-auto"
                />
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
                  <span>Fechas ya creadas (deshabilitadas)</span>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-md border border-yellow-200 max-w-md">
                  <p className="text-center">
                    Seleccione una fecha disponible en el calendario para crear
                    una nueva actividad. Las fechas en gris ya tienen
                    actividades existentes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {(mode === MODAL_MODES.ACTIVITY_ADD ||
          mode === MODAL_MODES.ACTIVITY_EDIT) && (
          <>
            {step === 1 && mode !== MODAL_MODES.ACTIVITY_EDIT ? (
              <>
                <div className="overflow-y-auto flex-grow pr-2 mb-4">
                  {dateIndicator}
                  {renderLanguageSelector}
                  {loadingIndicator}
                  {!loadingTypes && activityTypeButtons}
                  {!loadingTypes && activityTypes.length === 0 && !error && (
                    <p>No hay tipos de actividad disponibles.</p>
                  )}
                  {error && <p className="text-red-500">{error}</p>}
                </div>
                <DialogFooter className="flex-shrink-0 border-t pt-4 mt-auto">
                  <Button
                    onClick={handleNext}
                    disabled={!activityType || loadingTypes}
                    className="ml-auto"
                  >
                    Siguiente
                  </Button>
                </DialogFooter>
              </>
            ) : step === 2 ? (
              <>
                <div className="overflow-y-auto flex-grow pr-2 mb-4">
                  <form id="activity-form" onSubmit={handleSubmit(onSubmit)}>
                    {dateIndicator}
                    <div className="flex items-center justify-between mb-4 p-2 bg-gray-100 rounded-md">
                      <div className="flex items-center gap-2">
                        <Languages size={16} className="text-primary" />
                        <span className="text-sm font-medium">
                          {selectedLanguage === "1" ? "English" : "Español"}
                          {mode === MODAL_MODES.ACTIVITY_EDIT &&
                            " (No editable)"}
                        </span>
                      </div>
                      {mode !== MODAL_MODES.ACTIVITY_EDIT && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleBack}
                          className="text-xs"
                        >
                          Cambiar Tipo/Idioma
                        </Button>
                      )}
                    </div>

                    <div className="mb-4 p-2 bg-gray-50 rounded-md text-xs text-gray-500 flex items-center">
                      <AlertCircle size={14} className="text-primary mr-2" />
                      Todos los campos marcados con{" "}
                      <span className="text-red-500 mx-1">*</span> son
                      obligatorios
                    </div>

                    {renderFormFields}
                  </form>
                </div>
                <DialogFooter className="flex-shrink-0 border-t pt-4 mt-auto justify-between">
                  <Button
                    variant="outline"
                    onClick={
                      mode === MODAL_MODES.ACTIVITY_EDIT ? onClose : handleBack
                    }
                    type="button"
                  >
                    {mode === MODAL_MODES.ACTIVITY_EDIT ? "Cancelar" : "Volver"}
                  </Button>
                  <Button
                    type="submit"
                    form="activity-form"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {mode === MODAL_MODES.ACTIVITY_EDIT
                      ? "Actualizar"
                      : "Guardar"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin inline-block mr-2" />
                <span>Cargando...</span>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
