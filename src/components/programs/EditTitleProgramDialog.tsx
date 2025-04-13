import { Edit } from "lucide-react";
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
import { FC, useState } from "react";
import {
  ProgramCategory,
  ProgramDetail,
} from "../../pages/Programs/types/Program";
import { useEventStore } from "@/stores/eventStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import ProgramsService from "../../pages/Programs/services/ProgramsService";
import { toast } from "sonner";

type Props = {
  programCategories: ProgramCategory[];
  programDetail: ProgramDetail;
  date: string;
  onDeleteSuccess?: () => void;
};

const EditTitleProgramDialog: FC<Props> = ({
  programDetail,
  date,
  onDeleteSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState(
    programDetail.descripcion || ""
  );
  const { selectedEvent } = useEventStore();

  // Reset the form when the dialog opens
  const handleDialogChange = (open: boolean) => {
    if (open) {
      setDescription(programDetail.descripcion || "");
      setError(null);
    }
    setIsOpen(open);
  };

  // Validate and submit the form
  const handleSubmit = async () => {
    // Validate
    if (!description || description.trim().length < 3) {
      setError(
        "La descripción es obligatoria y debe tener al menos 3 caracteres"
      );
      return;
    }
    if (!selectedEvent) {
      setError("No hay un evento seleccionado");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Send the update request
      await ProgramsService.updateProgram({
        fechaPrograma: date,
        idEvento: selectedEvent.idEvent,
        descripcionPro: description.trim(),
        idPrograma: programDetail.idPrograma,
      });

      // Show success message
      toast.success("Programa actualizado", {
        description:
          "La descripción del programa ha sido actualizada correctamente",
      });

      // Close the dialog
      setIsOpen(false);

      // Call the refresh function if provided
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      console.error("Error updating program:", err);
      setError("Error al actualizar la descripción del programa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit size={14} />
          Editar titulo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Editar titulo del programa</DialogTitle>
          <DialogDescription>
            Actualice el titulo del programa para la fecha {date}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md text-red-700 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Descripción del programa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="min-h-[100px]"
            />
            {description.length < 3 && (
              <p className="text-amber-600 text-xs flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Ingrese al menos 3 caracteres
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
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

export default EditTitleProgramDialog;
