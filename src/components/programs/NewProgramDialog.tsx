import { FC, useState, useCallback, useEffect } from "react";
import { Plus, AlertTriangle, Loader2, CalendarIcon, Languages, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ProgramForm from "../../pages/Programs/components/ProgramForm/ProgramForm";
import useProgramForm from "../../pages/Programs/components/ProgramForm/hooks/useProgramFrom";
import ProgramsService from "../../pages/Programs/services/ProgramsService";
import { ProgramForm as ProgramFormType } from "../../pages/Programs/components/ProgramForm/types/ProgramForm";
import { ProgramCategory } from "../../pages/Programs/types/Program";
import { useEventStore } from "@/stores/eventStore";
import { toast } from "sonner";

type Props = {
  programCategories: ProgramCategory[];
  existingDates?: string[];
  onProgramAdded?: () => Promise<void>;
};

enum ModalStep {
  DATE_SELECT = "DATE_SELECT",
  PROGRAM_FORM = "PROGRAM_FORM"
}

const NewProgramDialog: FC<Props> = ({
  programCategories,
  existingDates = [],
  onProgramAdded
}) => {
  const form = useProgramForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState<ModalStep>(ModalStep.DATE_SELECT);
  const [selectedLanguage, setSelectedLanguage] = useState<"1" | "2">("2"); // 1 = English, 2 = Spanish
  const { selectedEvent } = useEventStore();

  // Reset the form and state when the dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        detalles: [{ horaFin: "", horaIni: "", descripcionBody: "" }],
        descripcionPro: "",
        fechaPrograma: "",
      });
      setError(null);
      setSelectedDate(undefined);
      setStep(ModalStep.DATE_SELECT);
      setSelectedLanguage("2"); // Reset to Spanish
    }
  }, [isOpen, form]);

  // Format a date to YYYY-MM-DD string
  const formatDateToString = useCallback((date: Date | undefined): string => {
    if (!date) return "";
    if (!isValid(date)) return "";
    return format(date, "yyyy-MM-dd");
  }, []);

  // Format a date for display
  const formatDateForDisplay = useCallback((date: Date | undefined): string => {
    if (!date) return "";
    if (!isValid(date)) return "";
    return format(date, "EEEE d 'de' MMMM, yyyy", { locale: es });
  }, []);

  // Check if a date already has a program
  const isDateDisabled = useCallback((date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return existingDates.includes(dateStr);
  }, [existingDates]);

  // Handle date selection
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date) return;

    // Validate the date before proceeding
    if (existingDates.includes(format(date, "yyyy-MM-dd"))) {
      setError("Esta fecha ya tiene un programa creado.");
      return;
    }

    setSelectedDate(date);

    // Set the date in the form
    const dateStr = format(date, "yyyy-MM-dd");
    form.setValue("fechaPrograma", dateStr);

    // Initialize one detail with empty times
    form.setValue("detalles", [{
      horaIni: `${dateStr}T00:00`,
      horaFin: `${dateStr}T00:00`,
      descripcionBody: "",
      idIdioma: selectedLanguage === "1" ? 1 : 2
    }]);

    setError(null);
    setStep(ModalStep.PROGRAM_FORM);
  }, [existingDates, form, selectedLanguage]);

  // Handle going back to date selection
  const handleBackToDateSelect = useCallback(() => {
    setStep(ModalStep.DATE_SELECT);
  }, []);

  // Validate the form before submission
  const validateForm = useCallback((program: ProgramFormType): string | null => {
    if (!program.descripcionPro || program.descripcionPro.trim().length < 3) {
      return "La descripción del programa es obligatoria y debe tener al menos 3 caracteres";
    }

    if (!program.fechaPrograma) {
      return "Debe seleccionar una fecha para el programa";
    }

    if (!program.detalles || program.detalles.length === 0) {
      return "Debe añadir al menos un detalle de horario";
    }

    // Validate each detail
    for (let i = 0; i < program.detalles.length; i++) {
      const detail = program.detalles[i];

      if (!detail.horaIni) {
        return `El detalle #${i + 1} debe tener una hora de inicio`;
      }

      if (!detail.horaFin) {
        return `El detalle #${i + 1} debe tener una hora de fin`;
      }

      if (!detail.tipoPrograma) {
        return `El detalle #${i + 1} debe tener un tipo de programa seleccionado`;
      }

      if (!detail.descripcionBody || detail.descripcionBody.trim().length < 3) {
        return `El detalle #${i + 1} debe tener una descripción de al menos 3 caracteres`;
      }

      // If program type is 3 (which requires additional fields according to your form)
      if (detail.tipoPrograma === 3) {
        if (!detail.idIdioma) {
          return `El detalle #${i + 1} debe tener un idioma seleccionado`;
        }

        if (!detail.sala || detail.sala.trim().length === 0) {
          return `El detalle #${i + 1} debe tener una sala especificada`;
        }

        if (!detail.idAutor || detail.idAutor.trim().length === 0) {
          return `El detalle #${i + 1} debe tener al menos un autor seleccionado`;
        }
      }
    }

    return null;
  }, []);

  // Handle form submission
  const onSubmit = async (program: ProgramFormType) => {
    if (!selectedEvent) {
      setError("No hay un evento seleccionado");
      return;
    }

    if (!selectedDate) {
      setError("No hay una fecha seleccionada");
      return;
    }

    // Additional validation
    const validationError = validateForm(program);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add the selected event ID to the program data
      // The date is already set in the form when selecting a date
      await ProgramsService.addProgram({
        ...program,
        idEvento: selectedEvent.idEvent
      });

      toast.success("Programa creado correctamente", {
        description: `Se ha creado un nuevo programa para el ${formatDateForDisplay(selectedDate)}`,
      });

      setIsOpen(false);

      // Call the callback for refreshing programs
      if (onProgramAdded) {
        await onProgramAdded();
      }
    } catch (err) {
      console.error("Error creating program:", err);
      setError("Error al crear el programa. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  function handleClose() {
    if (!loading) {
      setIsOpen(false);
      setError(null);
    }
  }

  // Language selector change handler
  const handleLanguageChange = useCallback((language: "1" | "2") => {
    setSelectedLanguage(language);

    // Update language for all details without creating an infinite loop
    const details = form.getValues("detalles") || [];
    if (details.length > 0) {
      const updatedDetails = details.map(detail => ({
        ...detail,
        idIdioma: language === "1" ? 1 : 2
      }));
      form.setValue("detalles", updatedDetails);
    }
  }, [form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // If we're closing the dialog and not in loading state
      if (!open && !loading) {
        handleClose();
      } else if (open) {
        setIsOpen(true);
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus size={16} className="mr-1" />
          Crear nueva fecha
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md md:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            {step === ModalStep.DATE_SELECT
              ? "Seleccionar fecha para el programa"
              : "Crear programa"}
          </DialogTitle>
          <DialogDescription>
            {step === ModalStep.DATE_SELECT
              ? "Elija una fecha disponible para crear un nuevo programa"
              : "Complete el formulario para crear un nuevo programa"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-md text-red-700 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {step === ModalStep.DATE_SELECT ? (
          <div className="py-6">
            <div className="mx-auto max-w-sm bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                initialFocus
                className="mx-auto"
              />
            </div>

            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
                <span>Fechas con programas existentes</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-md border border-yellow-200 max-w-md">
                <p className="text-center">
                  Seleccione una fecha disponible en el calendario para crear un nuevo programa.
                  Las fechas en gris ya tienen programas existentes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {selectedDate && (
              <div className="mb-6 p-3 bg-primary/10 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">{formatDateForDisplay(selectedDate)}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleBackToDateSelect}
                  disabled={loading}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cambiar fecha
                </Button>
              </div>
            )}

            {/* Language selector */}
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
                        handleLanguageChange("1");
                      }
                    }}
                  />
                  <Label htmlFor="language-en" className="cursor-pointer">
                    English
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="language-es"
                    checked={selectedLanguage === "2"}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleLanguageChange("2");
                      }
                    }}
                  />
                  <Label htmlFor="language-es" className="cursor-pointer">
                    Español
                  </Label>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {selectedLanguage === "1"
                  ? "The program will be created in English"
                  : "El programa será creado en Español"}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 flex items-center mb-4">
              <Info size={16} className="text-primary mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Instrucciones:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Complete la descripción del programa (mínimo 3 caracteres)</li>
                  <li>Complete los campos de horario, tipo y descripción del detalle</li>
                  <li>Para programas de tipo "Conferencia" complete todos los campos adicionales</li>
                  <li>Todos los campos marcados con * son obligatorios</li>
                </ul>
              </div>
            </div>

            <ProgramForm
              form={form}
              programCategories={programCategories}
              onSubmit={onSubmit}
              disabled={loading}
              forEdit={false}
            />
          </>
        )}

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>

          {step === ModalStep.PROGRAM_FORM && (
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              onClick={form.handleSubmit(onSubmit)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear programa'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProgramDialog;