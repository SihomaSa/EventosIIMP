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

const NewProgramDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Crear programa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear programa</DialogTitle>
        </DialogHeader>
        <ProgramForm />
        <DialogFooter>
          <Button type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProgramDialog;
