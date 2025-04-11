import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgramDatePicker from "./components/ProgramDatePicker";
import { FC, useEffect, useState } from "react";
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
import { MultiSelect } from "@/components/ui-custom/multi-select";
import { getExpositors } from "@/components/services/expositorsService";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  form: UseFormReturn<ProgramFormType, undefined, ProgramFormType>;
  onSubmit: (program: ProgramFormType) => void;
  disabled: boolean;
  programCategories: ProgramCategory[];
};

const ProgramForm: FC<Props> = ({
  form: { handleSubmit, register, watch, setValue },
  onSubmit,
  disabled,
  programCategories,
}) => {
  const dateStr = watch("fechaPrograma");
  const details = watch("detalles");
  const [loading, setLoading] = useState(false);
  const [expositors, setExpositors] = useState<ExpositorType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExpositors() {
      try {
        setLoading(true);
        const expositors = await getExpositors();
        setExpositors(expositors);
      } catch {
        setError("Error al cargar expositores");
      } finally {
        setLoading(false);
      }
    }
    loadExpositors();
  }, []);

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
    const idAutor = details[index]?.idAutor;
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
            <MultiSelect
              className="w-fit max-w-3xs"
              placeholder="Autores"
              selected={idAutor ? idAutor.split(",") : []}
              onChange={(selected) =>
                setValue(`detalles.${index}.idAutor`, selected.join(","))
              }
              options={expositors.map((expositor) => ({
                label: `${expositor.nombres}, ${expositor.apellidos}`,
                value: `${expositor.idAutor}`,
              }))}
            />
          </>
        )}
      </>
    );
  }

  if (loading)
    return (
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-6 w-1/3 bg-primary/60" />
        <Skeleton className="h-6 w-full bg-primary/60" />
        <Skeleton className="h-6 w-full bg-primary/60" />
        <Skeleton className="h-6 w-full bg-primary/60" />
      </div>
    );

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
          disabled={disabled}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fechaPrograma" className="text-right">
          Fecha
        </Label>
        <ProgramDatePicker
          id="fechaPrograma"
          disabled={disabled}
          date={dateStr ? new Date(dateStr) : undefined}
          setDate={handleSetDate}
        />
      </div>

      <p className="text-sm">Hora de inicio / Hora de fin</p>

      {details.map(({ tipoPrograma }, index) => (
        <div className="flex gap-2" key={index}>
          <Input
            className="flex min-w-max max-w-[100px]"
            {...register(`detalles.${index}.horaIni`)}
            type="time"
            placeholder="Hora inicio"
          />
          <Input
            className="flex min-w-max max-w-[100px]"
            {...register(`detalles.${index}.horaFin`)}
            type="time"
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

      <Button onClick={addSubProgram} disabled={disabled}>
        Añadir horario
      </Button>

      {error && <p className="bg-destructive">{error}</p>}

      <DialogFooter>
        <Button type="submit">Crear</Button>
      </DialogFooter>
    </form>
  );
};

export default ProgramForm;
