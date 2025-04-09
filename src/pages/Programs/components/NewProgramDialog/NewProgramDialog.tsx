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
import ProgramForm from "../ProgramForm/ProgramForm";
import useProgramForm from "../ProgramForm/hooks/useProgramFrom";
import ProgramsService from "../../services/ProgramsService";
import { FC, useState } from "react";
import { ProgramForm as ProgramFormType } from "../ProgramForm/types/ProgramForm";
import { ProgramCategory } from "../../types/Program";

type Props = {
  programCategories: ProgramCategory[];
};

const NewProgramDialog: FC<Props> = ({ programCategories }) => {
  const form = useProgramForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  async function onSubmit(program: ProgramFormType) {
    try {
      setLoading(true);
      await ProgramsService.addProgram(program);
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
      <DialogContent className="!max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Crear programa</DialogTitle>
        </DialogHeader>
        {!error && (
          <ProgramForm
            programCategories={programCategories}
            form={form}
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
