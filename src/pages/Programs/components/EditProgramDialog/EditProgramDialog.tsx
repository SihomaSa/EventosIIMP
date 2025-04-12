import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProgramForm from "../ProgramForm/ProgramForm";
import useProgramForm from "../ProgramForm/hooks/useProgramFrom";
import ProgramsService from "../../services/ProgramsService";
import { FC, useState } from "react";
import { ProgramForm as ProgramFormType } from "../ProgramForm/types/ProgramForm";
import { Program, ProgramCategory } from "../../types/Program";
import { useEventStore } from "@/stores/eventStore";
import { mapProgramToForm } from "../ProgramForm/utils/mapProgramToForm";

type Props = {
  programCategories: ProgramCategory[];
  program: Program;
};

const EditProgramDialog: FC<Props> = ({ programCategories, program }) => {
  const form = useProgramForm(mapProgramToForm(program));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const { selectedEvent } = useEventStore();

  async function onSubmit(program: ProgramFormType) {
    try {
      setLoading(true);
      if (!selectedEvent) {
        return;
      }
      await ProgramsService.updateProgram({
        ...program,
        idEvento: selectedEvent.idEvent,
      });
    } catch {
      setError("Error al editar programa");
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
        <Button size="sm" className="text-xs">
          <Edit />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Editar programa</DialogTitle>
        </DialogHeader>
        {!error && (
          <ProgramForm
            forEdit
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

export default EditProgramDialog;
