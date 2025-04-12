import { Plus, AlertTriangle, Loader2 } from "lucide-react";
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
import ProgramForm from "../../pages/Programs/components/ProgramForm/ProgramForm";
import useProgramForm from "../../pages/Programs/components/ProgramForm/hooks/useProgramFrom";
import ProgramsService from "../../pages/Programs/services/ProgramsService";
import { FC, useState } from "react";
import { ProgramForm as ProgramFormType } from "../../pages/Programs/components/ProgramForm/types/ProgramForm";
import { ProgramCategory } from "../../pages/Programs/types/Program";
import { useEventStore } from "@/stores/eventStore";
import { toast } from "sonner";

type Props = {
  programCategories: ProgramCategory[];
};

const NewProgramDialog: FC<Props> = ({ programCategories }) => {
  const form = useProgramForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedEvent } = useEventStore();

  async function onSubmit(program: ProgramFormType) {
    if (!selectedEvent) {
      setError("No hay un evento seleccionado");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await ProgramsService.addProgram({
        ...program,
        idEvento: selectedEvent.idEvent,
      });

      toast.success("Programa creado correctamente");
      setIsOpen(false);

      // Reload after a short delay to ensure the dialog closes properly
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err) {
      console.error("Error creating program:", err);
      setError("Error al crear el programa. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setIsOpen(false);
      setError(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus size={16} className="mr-1" />
          Crear programa
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            Crear programa
          </DialogTitle>
          <DialogDescription>
            Complete el formulario para crear un nuevo programa
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-md text-red-700 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <ProgramForm
          form={form}
          programCategories={programCategories}
          onSubmit={onSubmit}
          disabled={loading}
        />

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>

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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProgramDialog;