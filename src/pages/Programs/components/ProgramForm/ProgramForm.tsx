import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgramDatePicker from "./components/ProgramDatePicker";

const ProgramForm = () => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Descripción
        </Label>
        <Input id="description" placeholder="..." className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Username
        </Label>
        <ProgramDatePicker id="username" className="col-span-3" />
      </div>
    </div>
  );
};

export default ProgramForm;
