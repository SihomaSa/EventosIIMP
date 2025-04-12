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
import { ProgramCategory, ProgramDetail } from "../../types/Program";
import { useEventStore } from "@/stores/eventStore";
import { mapProgramDetailToForm } from "../ProgramForm/utils/mapProgramDetailToForm";

type Props = {
  programCategories: ProgramCategory[];
  programDetail: ProgramDetail;
  date: string;
};

const EditProgramDialog: FC<Props> = ({
  programCategories,
  programDetail,
  date,
}) => {
  const form = useProgramForm(mapProgramDetailToForm(programDetail, date));
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
      alert("Programa editado correctamente");
      window.location.reload();
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
