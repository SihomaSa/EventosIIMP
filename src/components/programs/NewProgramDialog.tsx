import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProgramForm from "../../pages/Programs/components/ProgramForm/ProgramForm";
import useProgramForm from "../../pages/Programs/components/ProgramForm/hooks/useProgramFrom";
import ProgramsService from "../../pages/Programs/services/ProgramsService";
import { FC, useState } from "react";
import { ProgramForm as ProgramFormType } from "../../pages/Programs/components/ProgramForm/types/ProgramForm";
import { ProgramCategory } from "../../pages/Programs/types/Program";
import { useEventStore } from "@/stores/eventStore";

type Props = {
  programCategories: ProgramCategory[];
};

const NewProgramDialog: FC<Props> = ({ programCategories }) => {
  const form = useProgramForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const { selectedEvent } = useEventStore();

  async function onSubmit(program: ProgramFormType) {
    try {
      setLoading(true);
      if (!selectedEvent) {
        return;
      }
      await ProgramsService.addProgram({
        ...program,
        idEvento: selectedEvent.idEvent,
      });
      alert("Programa creado correctamente");
      window.location.reload();
    } catch {
      setError("Error al crear programa");
    } finally {
      setLoading(false);
    }
  }

  function clearErrors() {
    setError(null);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Crear programa
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Crear programa</DialogTitle>
        </DialogHeader>
        {!error && (
          <ProgramForm
            form={form}
            programCategories={programCategories}
            onSubmit={onSubmit}
            disabled={loading}
          />
        )}
        {error && (
          <>
            <p className="text-destructive">{error}</p>
            <DialogFooter>
              <Button onClick={clearErrors} type="submit">
                Reintentar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewProgramDialog;
