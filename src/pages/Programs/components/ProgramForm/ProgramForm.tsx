import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgramDatePicker from "./components/ProgramDatePicker";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProgramForm as ProgramFormType } from "./types/ProgramForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgramCategory } from "../../types/Program";
import { ExpositorType } from "@/types/expositorTypes";

type Props = {
  form: UseFormReturn<ProgramFormType, unknown, undefined>;
  onSubmit: (program: ProgramFormType) => void;
  disabled: boolean;
  programCategories: ProgramCategory[];
  expositors: ExpositorType[];
};

const ProgramForm: FC<Props> = ({
  form: { handleSubmit, register, watch, setValue },
  onSubmit,
  disabled,
  programCategories,
}) => {
  const dateStr = watch("fechaPrograma");
  const details = watch("detalles");

  function handleSetDate(newDate?: Date) {
    let parsedDate = "";
    if (newDate) {
      const date = new Date(newDate);
      const YYYY = date.getFullYear();
      const MM = date.getMonth() + 1;
      const DD = date.getDate();
      parsedDate = `${YYYY}-${MM}-${DD}`;
    }
    setValue("fechaPrograma", parsedDate);
  }

  function addSubProgram() {
    setValue("detalles", [
      ...details,
      {
        horaFin: "",
        horaIni: "",
      },
    ]);
  }

  function detailFormByProgramId(index: number) {
    const tipoPrograma = details[index]?.tipoPrograma;
    if (!tipoPrograma) return;
    const idIdioma = details[index]?.idIdioma;
    return (
      <>
        <Input
          {...register(`detalles.${index}.descripcionBody`)}
          placeholder="Descripción"
        />
        <Select
          value={idIdioma ? `${idIdioma}` : undefined}
          onValueChange={(value) =>
            setValue(`detalles.${index}.idIdioma`, Number(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Idioma</SelectLabel>
              <SelectItem value="1">Español</SelectItem>
              <SelectItem value="2">Inglés</SelectItem>
              <SelectItem value="3">Español / Inglés</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {tipoPrograma === 3 && (
          <>
            <Input {...register(`detalles.${index}.sala`)} placeholder="Sala" />
            {/* TODO: Multiselect */}
            <Input
              {...register(`detalles.${index}.idAutor`)}
              placeholder="idAutor"
            />
          </>
        )}
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Descripción
        </Label>
        <Input
          {...register(`descripcionPro`, {
            required: true,
          })}
          id="description"
          placeholder="..."
          className="col-span-3"
          disabled={disabled}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fechaPrograma" className="text-right">
          Fecha
        </Label>
        <ProgramDatePicker
          id="fechaPrograma"
          className="col-span-3"
          disabled={disabled}
          date={dateStr ? new Date(dateStr) : undefined}
          setDate={handleSetDate}
        />
      </div>

      <p className="text-sm">Hora de inicio / Hora de fin</p>

      {details.map(({ tipoPrograma }, index) => (
        <div className="flex gap-2" key={index}>
          <Input
            {...register(`detalles.${index}.horaIni`)}
            type="time"
            className="w-22"
            placeholder="Hora inicio"
          />
          <Input
            {...register(`detalles.${index}.horaFin`)}
            type="time"
            className="w-22"
            placeholder="Hora fin"
          />
          <Select
            value={tipoPrograma ? `${tipoPrograma}` : undefined}
            onValueChange={(value) =>
              setValue(`detalles.${index}.tipoPrograma`, Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de programa" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de programa</SelectLabel>
                {programCategories.map((category) => (
                  <SelectItem
                    value={String(category.idTipoPrograma)}
                    key={category.idTipoPrograma}
                  >
                    {category.descripcion}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {detailFormByProgramId(index)}
        </div>
      ))}

      <Button onClick={addSubProgram}>Añadir horario</Button>

      <DialogFooter>
        <Button type="submit" disabled>
          Crear
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProgramForm;
