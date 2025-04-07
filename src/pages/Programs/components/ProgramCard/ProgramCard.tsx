import { FC } from "react";
import { Program } from "../../types/Program";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseHourRange } from "./utils/parseHourRange";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

type Props = {
  program: Program;
};

const ProgramCard: FC<Props> = ({ program }) => {
  return (
    <Card>
      {program.detalles.map((detalle) => (
        <div
          className="relative flex flex-row gap-2 justify-between items-start px-2"
          key={`card-${program.fechaPrograma}-${detalle.idPrograma}`}
        >
          <div className="w-[400px] sticky top-4 flex flex-col gap-2">
            <p>{detalle.descripcion}</p>
            <div className="flex justify-center gap-2 w-full">
              <Button variant="outline" size="sm">
                <Edit />
                Editar
              </Button>
              <Button variant="destructive" size="sm">
                <Trash />
                Eliminar
              </Button>
            </div>
          </div>
          <Separator orientation="vertical" className="h-full" />
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-fit">Horario</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Autores</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Idioma</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalle.detalleAdicional.map((additional) => (
                <TableRow
                  key={`card-${program.fechaPrograma}-${detalle.idPrograma}-${additional.idProDetalle}`}
                >
                  <TableCell className="text-center w-fit">
                    {parseHourRange(additional.horaIni, additional.horaFin)}
                  </TableCell>
                  <TableCell
                    align="left"
                    className="overflow-ellipsis max-w-[100px] overflow-hidden"
                    title={additional.descripcionBody}
                  >
                    {additional.descripcionBody}
                  </TableCell>
                  <TableCell align="left">
                    {(additional.autores || []).map((autor) => (
                      <p>{`${autor.nombres} ${autor.apellidos}`}</p>
                    ))}
                  </TableCell>
                  <TableCell align="left">{additional.sala}</TableCell>
                  <TableCell align="left">{additional.descIdioma}</TableCell>
                  <TableCell align="left">{additional.tipoPrograma}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </Card>
  );
};

export default ProgramCard;
