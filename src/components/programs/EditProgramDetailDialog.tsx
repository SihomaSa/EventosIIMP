import { FC, useState, useEffect } from "react";
import { Edit, Plus, Trash } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Loader2,
  Clock,
  Languages,
  Info,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ProgramCategory } from "../../pages/Programs/types/Program";
import ProgramsService from "../../pages/Programs/services/ProgramsService";
import { useEventStore } from "@/stores/eventStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ProgramMultiSelect } from "../../pages/Programs/components/ProgramForm/components/ProgramMultiSelect";
import { getExpositors } from "@/components/services/expositorsService";
import { ExpositorType } from "@/types/expositorTypes";

type Autor = {
  idAutor: string;
  nombres: string;
  apellidos: string;
};

type ProgramDetailForEdit = {
  idProDetalle: number;
  descripcionBody: string;
  horaIni: string;
  horaFin: string;
  idIdioma: number;
  descIdioma?: string;
  tipoPrograma: number;
  sala?: string;
  autores?: Autor[];
  idAutor?: string;
};

type ProgramForEdit = {
  fechaPrograma: string;
  idEvento: number;
  idPrograma: number;
  descripcionPro: string;
  detalles: ProgramDetailForEdit[];
};

type Props = {
  programDetail: ProgramDetailForEdit;
  programCategories: ProgramCategory[];
  date: string;
  programDescription: string;
  programId: number;
  onUpdateSuccess?: () => void;
};

const EditProgramDetailDialog: FC<Props> = ({
  programDetail,
  programCategories,
  date,
  programDescription,
  programId,
  onUpdateSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expositors, setExpositors] = useState<ExpositorType[]>([]);

  // Find the current program category
  const getCurrentCategory = (tipoPrograma: number) =>
    programCategories.find(
      (category) => category.idTipoPrograma === tipoPrograma
    );

  const [formData, setFormData] = useState<ProgramDetailForEdit>({
    ...programDetail,
    // Ensure autores is always an array
    autores: programDetail.autores || [],
  });

  const { selectedEvent } = useEventStore();

  // Load expositors when dialog opens
  useEffect(() => {
    const loadExpositors = async () => {
      try {
        const fetchedExpositors = await getExpositors();
        setExpositors(fetchedExpositors);
      } catch (err) {
        console.error("Error loading expositors:", err);
        toast.error("No se pudieron cargar los autores");
      }
    };
    if (isOpen) {
      loadExpositors();
    }
  }, [isOpen]);

  // Reset the form when the dialog opens
  const handleDialogChange = (open: boolean) => {
    if (open) {
      setFormData({
        ...programDetail,
        autores: programDetail.autores || [],
      });
      setError(null);
    }
    setIsOpen(open);
  };

  // Extract time from datetime string
  const extractTime = (dateTimeStr: string): string => {
    return dateTimeStr ? dateTimeStr.split("T")[1] : "";
  };

  // Validate form
  const validateForm = (): string | null => {
    const startTime = extractTime(formData.horaIni);
    const endTime = extractTime(formData.horaFin);
    if (!startTime) {
      return "Debe seleccionar una hora de inicio";
    }
    if (!endTime) {
      return "Debe seleccionar una hora de fin";
    }
    if (endTime <= startTime) {
      return "La hora de fin debe ser posterior a la hora de inicio";
    }
    if (
      !formData.descripcionBody ||
      formData.descripcionBody.trim().length < 3
    ) {
      return "La descripción debe tener al menos 3 caracteres";
    }
    if (!formData.tipoPrograma) {
      return "Debe seleccionar un tipo de programa";
    }

    // Validate room if required
    if (
      formData.tipoPrograma === 3 &&
      (!formData.autores || formData.autores.length === 0)
    ) {
      return "Debe seleccionar al menos un autor para este tipo de programa";
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log(formData);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!selectedEvent) {
      setError("No hay un evento seleccionado");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Prepare the full program object for update
      const programToUpdate: ProgramForEdit = {
        fechaPrograma: date,
        idEvento: selectedEvent.idEvent,
        descripcionPro: programDescription,
        idPrograma: programId,
        detalles: [
          {
            ...formData,
            // Only include sala and autores if type is 3 (other)
            ...(formData.tipoPrograma === 3
              ? {
                  sala: formData.sala,
                  autores: formData.autores,
                  idAutor:
                    formData.idAutor ||
                    (formData.autores && formData.autores.length > 0
                      ? formData.autores.map((a) => a.idAutor).join(",")
                      : undefined),
                }
              : {
                  sala: undefined,
                  autores: undefined,
                  idAutor: undefined,
                }),
          },
        ],
      };
      console.log("Program to update:", programToUpdate);
      await ProgramsService.updateProgram(programToUpdate);
      // Show success message
      toast.success("Detalle de programa actualizado", {
        description:
          "El detalle del programa ha sido actualizado correctamente",
      });
      // Close the dialog
      setIsOpen(false);
      // Call the refresh function if provided
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Error updating program detail:", err);
      setError("Error al actualizar el detalle del programa");
    } finally {
      setLoading(false);
    }
  };

  // Get current category
  const currentCategory = getCurrentCategory(formData.tipoPrograma);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
        >
          <Edit size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Editar detalle del programa
          </DialogTitle>
          <DialogDescription>
            Actualice los detalles del programa
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md text-red-700 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}
        <div className="space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="descripcionBody" className="flex items-center">
              <Info size={16} className="mr-2 text-primary" />
              Descripción <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="descripcionBody"
              placeholder="Descripción del detalle"
              value={formData.descripcionBody}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descripcionBody: e.target.value,
                }))
              }
              disabled={loading}
              className="min-h-[100px]"
            />
            {formData.descripcionBody.length < 3 && (
              <p className="text-amber-600 text-xs flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Ingrese al menos 3 caracteres
              </p>
            )}
          </div>
          {/* Time Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaIni" className="flex items-center">
                <Clock size={16} className="mr-2 text-primary" />
                Hora de inicio <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="horaIni"
                type="time"
                value={extractTime(formData.horaIni)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    horaIni: `${date}T${e.target.value}`,
                  }))
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFin" className="flex items-center">
                <Clock size={16} className="mr-2 text-primary" />
                Hora de fin <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="horaFin"
                type="time"
                value={extractTime(formData.horaFin)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    horaFin: `${date}T${e.target.value}`,
                  }))
                }
                disabled={loading}
              />
            </div>
          </div>
          {/* Program Type */}
          <div className="space-y-2">
            <Label htmlFor="tipoPrograma" className="flex items-center">
              <Info size={16} className="mr-2 text-primary" />
              Tipo de programa <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.tipoPrograma.toString()}
              onValueChange={(value) =>
                setFormData((prev) => {
                  const newTipoPrograma = parseInt(value);

                  return {
                    ...prev,
                    tipoPrograma: newTipoPrograma,
                    ...(newTipoPrograma !== 3
                      ? {
                          sala: undefined,
                          ...(prev.autores && prev.autores.length > 0
                            ? { autores: prev.autores }
                            : { autores: [] }),
                          idAutor: prev.idAutor ? prev.idAutor : undefined,
                        }
                      : {}),
                  };
                })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo de programa" />
              </SelectTrigger>
              <SelectContent>
                {programCategories.map((category) => (
                  <SelectItem
                    key={category.idTipoPrograma}
                    value={category.idTipoPrograma.toString()}
                  >
                    {category.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="idIdioma" className="flex items-center">
              <Languages size={16} className="mr-2 text-primary" />
              Idioma <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.idIdioma.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  idIdioma: parseInt(value),
                  descIdioma: value === "1" ? "INGLES" : "ESPAÑOL",
                }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Inglés</SelectItem>
                <SelectItem value="2">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room (Optional) */}
          {formData.tipoPrograma === 3 && (
            <div className="space-y-2">
              <Label htmlFor="sala" className="flex items-center">
                <Info size={16} className="mr-2 text-primary" />
                Sala <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="sala"
                placeholder="Ingrese la sala si aplica..."
                value={formData.sala || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sala: e.target.value || undefined,
                  }))
                }
                disabled={loading}
              />
            </div>
          )}

          {/* Authors (Optional) */}
          {formData.tipoPrograma === 3 && (
            <div className="space-y-2">
              <Label className="flex items-center">
                <Users size={16} className="mr-2 text-primary" />
                Autores <span className="text-red-500 ml-1">*</span>
              </Label>
              <ProgramMultiSelect
                className="w-full"
                placeholder="Seleccionar autores"
                selected={
                  formData.autores?.map((autor) => String(autor.idAutor)) || []
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    idAutor:
                      selected.length > 0 ? selected.join(",") : undefined,
                    autores: selected.map((id) => {
                      const expositor = expositors.find(
                        (e) => String(e.idAutor) === id
                      );
                      return expositor
                        ? {
                            idAutor: String(expositor.idAutor),
                            nombres: expositor.nombres,
                            apellidos: expositor.apellidos,
                          }
                        : { idAutor: id, nombres: "", apellidos: "" };
                    }),
                  }))
                }
                options={expositors.map((expositor) => ({
                  label: `${expositor.nombres} ${expositor.apellidos}`,
                  value: `${expositor.idAutor}`,
                }))}
              />
            </div>
          )}
        </div>
        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProgramDetailDialog;
