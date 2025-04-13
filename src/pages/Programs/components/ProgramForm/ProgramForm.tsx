import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC, useEffect, useRef, useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProgramForm as ProgramFormType } from "./types/ProgramForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgramCategory } from "../../types/Program";
import { ExpositorType } from "@/types/expositorTypes";
import { getExpositors } from "@/components/services/expositorsService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Clock,
  BadgeCheck,
  User,
  MessageSquare,
  MapPin,
  Users,
  Settings,
} from "lucide-react";
import { ProgramMultiSelect } from "./components/ProgramMultiSelect";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  form: UseFormReturn<ProgramFormType, unknown, ProgramFormType>;
  onSubmit: (program: ProgramFormType) => void;
  disabled: boolean;
  programCategories: ProgramCategory[];
  forEdit?: boolean;
  hideDescriptionPro?: boolean;
};

const ProgramForm: FC<Props> = ({
  form: { handleSubmit, register, watch, setValue, formState },
  onSubmit,
  disabled,
  programCategories,
  forEdit,
  hideDescriptionPro = false,
}) => {
  const dateStr = watch("fechaPrograma");
  const details = watch("detalles") || [];
  const descripcionPro = watch("descripcionPro");
  const [loading, setLoading] = useState(false);
  const [expositors, setExpositors] = useState<ExpositorType[]>([]);
  const [error, setError] = useState("");
  const detailsRef = useRef<HTMLDivElement>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, Record<string, string>>
  >({});

  // Use useMemo for form errors to avoid infinite loop
  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // Add form errors
    if (formState.errors.descripcionPro) {
      errors.descripcionPro =
        "La descripción es obligatoria y debe tener al menos 3 caracteres";
    }

    return errors;
  }, [formState.errors]);

  // Load expositors on component mount
  useEffect(() => {
    async function loadExpositors() {
      try {
        setLoading(true);
        const expositors = await getExpositors();
        setExpositors(expositors);
      } catch {
        setError("Error al cargar expositores");
      } finally {
        setLoading(false);
      }
    }
    loadExpositors();
  }, []);

  // Validate detail fields
  const validateDetail = (index: number) => {
    const detail = details[index];
    const errors: Record<string, string> = {};

    // Validate time fields
    const startTime = detail.horaIni?.split("T")[1] || "";
    const endTime = detail.horaFin?.split("T")[1] || "";

    if (!startTime) {
      errors.horaIni = "Hora de inicio es obligatoria";
    }

    if (!endTime) {
      errors.horaFin = "Hora de fin es obligatoria";
    } else if (startTime && endTime && endTime <= startTime) {
      errors.horaFin = "Hora de fin debe ser posterior a hora de inicio";
    }

    // Validate type
    if (!detail.tipoPrograma) {
      errors.tipoPrograma = "Tipo de programa es obligatorio";
    }

    // Validate description
    if (!detail.descripcionBody || detail.descripcionBody.trim().length < 3) {
      errors.descripcionBody = "Descripción es obligatoria (mín. 3 caracteres)";
    }

    // Validate additional fields for type 3 (Conference)
    if (detail.tipoPrograma === 3) {
      if (!detail.idIdioma) {
        errors.idIdioma = "Idioma es obligatorio";
      }

      if (!detail.sala || detail.sala.trim().length === 0) {
        errors.sala = "Sala es obligatoria";
      }

      if (!detail.idAutor || detail.idAutor.trim().length === 0) {
        errors.idAutor = "Debe seleccionar al menos un autor";
      }
    }

    // Update errors for this detail
    setValidationErrors((prev) => ({
      ...prev,
      [index]: errors,
    }));

    return Object.keys(errors).length === 0;
  };

  // Custom submit handler with validation
  const handleFormSubmit = (data: ProgramFormType) => {
    // Validate description length
    if (!data.descripcionPro || data.descripcionPro.trim().length < 3) {
      setValue("descripcionPro", data.descripcionPro, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setError(
        "La descripción del programa es obligatoria y debe tener al menos 3 caracteres"
      );
      return;
    }

    // Validate details
    let isValid = true;
    details.forEach((_, index) => {
      if (!validateDetail(index)) {
        isValid = false;
      }
    });

    if (!isValid) {
      setError(
        "Por favor complete todos los campos obligatorios en los detalles del programa"
      );
      return;
    }

    // If all validations pass, submit the form
    setError("");
    onSubmit(data);
  };

  // Loading state - Enhanced skeleton that matches the form layout
  if (loading) {
    return (
      <div className="grid gap-4 py-4">
        {/* Description skeleton */}
        <div className="p-3 border rounded-md">
          <Skeleton className="h-6 w-36 bg-primary/30 mb-2" />
          <Skeleton className="h-24 w-full bg-primary/30" />
        </div>

        {/* Program Details skeleton */}
        <div className="p-4 border rounded-md">
          <Skeleton className="h-6 w-48 bg-primary/30 mb-4" />

          <div className="space-y-4">
            {/* Program type skeleton */}
            <div className="p-3 border rounded-md">
              <Skeleton className="h-6 w-36 bg-primary/30 mb-2" />
              <Skeleton className="h-10 w-full bg-primary/30" />
            </div>

            {/* Time fields skeleton */}
            <div className="p-3 border rounded-md">
              <Skeleton className="h-6 w-24 bg-primary/30 mb-2" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full bg-primary/30" />
                <Skeleton className="h-10 w-full bg-primary/30" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="p-3 border rounded-md">
              <Skeleton className="h-6 w-36 bg-primary/30 mb-2" />
              <Skeleton className="h-10 w-full bg-primary/30" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 bg-primary/30" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-6 py-4">
      {/* Description */}
      {!hideDescriptionPro && (
        <div
          className={cn(
            "p-4 border rounded-md",
            fieldErrors.descripcionPro
              ? "border-red-300 bg-red-50/50"
              : "hover:border-primary/50 transition-colors"
          )}
        >
          <Label
            htmlFor="description"
            className="block mb-2 font-medium flex items-center gap-2"
          >
            <MessageSquare size={16} className="text-primary" />
            Descripción del programa <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-2">
            <Textarea
              {...register(`descripcionPro`, {
                required: true,
                minLength: 3,
              })}
              id="description"
              placeholder="Descripción general del programa..."
              disabled={disabled}
              className={cn(
                "min-h-[80px]",
                fieldErrors.descripcionPro
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              )}
            />
            {fieldErrors.descripcionPro && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                {fieldErrors.descripcionPro}
              </p>
            )}
            {!descripcionPro && !fieldErrors.descripcionPro && (
              <p className="text-amber-600 text-xs flex items-center">
                <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                Ingrese una descripción de al menos 3 caracteres
              </p>
            )}
          </div>
        </div>
      )}

      {/* Program Details */}
      <div className="border rounded-md p-4 space-y-5">
        <h3 className="text-md font-medium flex items-center gap-2 border-b pb-2">
          <Settings size={16} className="text-primary" />
          Detalle del programa <span className="text-red-500">*</span>
        </h3>

        <div ref={detailsRef} className="space-y-5">
          {details.map((detail, index) => {
            const startTime = detail.horaIni?.split("T")[1] || "";
            const endTime = detail.horaFin?.split("T")[1] || "";
            const detailErrors = validationErrors[index] || {};
            const hasTypeSelected = !!detail.tipoPrograma;

            return (
              <div
                key={index}
                className={cn(
                  "border rounded-md overflow-hidden",
                  Object.keys(detailErrors).length > 0
                    ? "border-red-300"
                    : "border-gray-200"
                )}
              >
                {/* Program Type Selection - Always Visible First */}
                <div className="p-4 bg-gray-50 border-b">
                  <Label
                    htmlFor={`tipo-programa-${index}`}
                    className="block mb-2 font-medium flex items-center gap-2"
                  >
                    <BadgeCheck size={16} className="text-primary" />
                    Tipo de programa <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <Select
                      value={
                        detail.tipoPrograma
                          ? `${detail.tipoPrograma}`
                          : undefined
                      }
                      onValueChange={(value) => {
                        setValue(
                          `detalles.${index}.tipoPrograma`,
                          Number(value)
                        );
                        validateDetail(index);
                      }}
                      disabled={disabled || forEdit}
                    >
                      <SelectTrigger
                        id={`tipo-programa-${index}`}
                        className={cn(
                          detailErrors.tipoPrograma
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        )}
                      >
                        <SelectValue placeholder="Seleccionar tipo de programa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo de programa</SelectLabel>
                          {programCategories.map((category) => (
                            <SelectItem
                              value={String(category.idTipoPrograma)}
                              key={category.idTipoPrograma}
                            >
                              {category.descripcion}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {detailErrors.tipoPrograma && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                        {detailErrors.tipoPrograma}
                      </p>
                    )}
                    {!detail.tipoPrograma && !detailErrors.tipoPrograma && (
                      <p className="text-amber-600 text-xs flex items-center">
                        <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                        Seleccione un tipo de programa para continuar
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Fields - Only visible after program type is selected */}
                {hasTypeSelected && (
                  <div className="p-4 space-y-4">
                    {/* Time fields */}
                    <div className="space-y-2">
                      <Label className="block mb-1 font-medium flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        Horario <span className="text-red-500">*</span>
                      </Label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label
                            htmlFor={`hora-ini-${index}`}
                            className="text-xs text-gray-500"
                          >
                            Hora inicio <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`hora-ini-${index}`}
                            className={cn(
                              detailErrors.horaIni
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            )}
                            value={startTime}
                            onChange={(e) => {
                              const value = e.target.value;
                              setValue(
                                `detalles.${index}.horaIni`,
                                `${dateStr}T${value}`
                              );
                              validateDetail(index);
                            }}
                            type="time"
                            placeholder="Hora inicio"
                            disabled={disabled}
                          />
                          {detailErrors.horaIni && (
                            <p className="text-red-500 text-xs flex items-center mt-1">
                              <AlertCircle
                                size={10}
                                className="mr-1 flex-shrink-0"
                              />
                              {detailErrors.horaIni}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label
                            htmlFor={`hora-fin-${index}`}
                            className="text-xs text-gray-500"
                          >
                            Hora fin <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`hora-fin-${index}`}
                            className={cn(
                              detailErrors.horaFin
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            )}
                            value={endTime}
                            onChange={(e) => {
                              const value = e.target.value;
                              setValue(
                                `detalles.${index}.horaFin`,
                                `${dateStr}T${value}`
                              );
                              validateDetail(index);
                            }}
                            type="time"
                            placeholder="Hora fin"
                            disabled={disabled}
                          />
                          {detailErrors.horaFin && (
                            <p className="text-red-500 text-xs flex items-center mt-1">
                              <AlertCircle
                                size={10}
                                className="mr-1 flex-shrink-0"
                              />
                              {detailErrors.horaFin}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="block mb-1 font-medium flex items-center gap-2">
                        <MessageSquare size={16} className="text-primary" />
                        Descripción <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register(`detalles.${index}.descripcionBody`)}
                        placeholder="Descripción del detalle"
                        className={cn(
                          detailErrors.descripcionBody
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        )}
                        onChange={(e) => {
                          setValue(
                            `detalles.${index}.descripcionBody`,
                            e.target.value
                          );
                          validateDetail(index);
                        }}
                      />
                      {detailErrors.descripcionBody && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle
                            size={10}
                            className="mr-1 flex-shrink-0"
                          />
                          {detailErrors.descripcionBody}
                        </p>
                      )}
                    </div>

                    {/* Additional fields for Conference (type 3) */}
                    {detail.tipoPrograma === 3 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <User size={16} className="text-primary" />
                          Información adicional para Conferencia{" "}
                          <span className="text-red-500">*</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Language Select */}
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500 flex items-center gap-1">
                              Idioma <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={
                                detail.idIdioma
                                  ? `${detail.idIdioma}`
                                  : undefined
                              }
                              onValueChange={(value) => {
                                setValue(
                                  `detalles.${index}.idIdioma`,
                                  Number(value)
                                );
                                validateDetail(index);
                              }}
                            >
                              <SelectTrigger
                                className={cn(
                                  detailErrors.idIdioma
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                                )}
                              >
                                <SelectValue placeholder="Seleccionar idioma" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Idioma</SelectLabel>
                                  <SelectItem value="2">Español</SelectItem>
                                  <SelectItem value="1">Inglés</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {detailErrors.idIdioma && (
                              <p className="text-red-500 text-xs flex items-center mt-1">
                                <AlertCircle
                                  size={10}
                                  className="mr-1 flex-shrink-0"
                                />
                                {detailErrors.idIdioma}
                              </p>
                            )}
                          </div>

                          {/* Room Input */}
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin size={10} className="text-primary" />
                              Sala <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              {...register(`detalles.${index}.sala`)}
                              placeholder="Sala / Ubicación"
                              className={cn(
                                detailErrors.sala
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              )}
                              onChange={(e) => {
                                setValue(
                                  `detalles.${index}.sala`,
                                  e.target.value
                                );
                                validateDetail(index);
                              }}
                            />
                            {detailErrors.sala && (
                              <p className="text-red-500 text-xs flex items-center mt-1">
                                <AlertCircle
                                  size={10}
                                  className="mr-1 flex-shrink-0"
                                />
                                {detailErrors.sala}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Authors MultiSelect */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500 flex items-center gap-1">
                            <Users size={10} className="text-primary" />
                            Autores <span className="text-red-500">*</span>
                          </Label>
                          <ProgramMultiSelect
                            className={cn(
                              "w-full",
                              detailErrors.idAutor ? "text-red-500" : ""
                            )}
                            placeholder="Seleccionar autores"
                            selected={
                              detail.idAutor ? detail.idAutor.split(",") : []
                            }
                            onChange={(selected) => {
                              setValue(
                                `detalles.${index}.idAutor`,
                                selected.join(",")
                              );
                              validateDetail(index);
                            }}
                            options={expositors.map((expositor) => ({
                              label: `${expositor.nombres}, ${expositor.apellidos}`,
                              value: `${expositor.idAutor}`,
                            }))}
                          />
                          {detailErrors.idAutor && (
                            <p className="text-red-500 text-xs flex items-center mt-1">
                              <AlertCircle
                                size={10}
                                className="mr-1 flex-shrink-0"
                              />
                              {detailErrors.idAutor}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </form>
  );
};

export default ProgramForm;
