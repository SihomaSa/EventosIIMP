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
import ProgramForm from "../../pages/Programs/components/ProgramForm/ProgramForm";
import useProgramForm from "../../pages/Programs/components/ProgramForm/hooks/useProgramFrom";
import ProgramsService from "../../pages/Programs/services/ProgramsService";
import { FC, useState } from "react";
import { ProgramForm as ProgramFormType } from "../../pages/Programs/components/ProgramForm/types/ProgramForm";
import { ProgramCategory, ProgramDetail } from "../../pages/Programs/types/Program";
import { useEventStore } from "@/stores/eventStore";
import { mapProgramDetailToForm } from "../../pages/Programs/components/ProgramForm/utils/mapProgramDetailToForm";

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
        <Button variant="outline">
          <Edit/>
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-2xl w-full">
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
