import { FC } from "react";
import { Program, ProgramCategory } from "../../types/Program";
import { Card } from "@/components/ui/card";
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
import { Plus, Trash } from "lucide-react";
import EditProgramDialog from "../EditProgramDialog/EditProgramDialog";
import ProgramsService from "../../services/ProgramsService";

type Props = {
  program: Program;
  programCategories: ProgramCategory[];
  date: string;
};

const ELLIPSE_CN = "overflow-ellipsis max-w-[120px] overflow-hidden";

const ProgramCard: FC<Props> = ({ program, programCategories, date }) => {
  function mapCategory(id: number) {
    const category = programCategories.find(
      (category) => category.idTipoPrograma === id
    );
    return category ? category.descripcion : `ID-${id}`;
  }

  async function deleteProgram(programId: number) {
    const confirmed = window.confirm("¿Desea eliminar este programa?");
    if (!confirmed) return;
    try {
      await ProgramsService.deleteProgram(programId);
      window.location.reload();
    } catch {
      console.error("Error al eliminar programa");
    }
  }

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
              <EditProgramDialog
                date={date}
                programDetail={detalle}
                programCategories={programCategories}
              />
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => deleteProgram(detalle.idPrograma)}
              >
                <Trash />
                Eliminar
              </Button>
            </div>
          </div>

          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-fit">Horario</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Autores</TableHead>
                <TableHead>Detalles</TableHead>
                {/* <TableHead>Acciones</TableHead> */}
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
                    className={ELLIPSE_CN}
                    title={additional.descripcionBody}
                  >
                    {additional.descripcionBody}
                  </TableCell>
                  <TableCell align="left">
                    {(additional.autores || []).map((autor) => (
                      <p
                        key={`card-${program.fechaPrograma}-${detalle.idPrograma}-${additional.idProDetalle}-${autor.idAutor}`}
                        className={ELLIPSE_CN}
                        title={`${autor.nombres} ${autor.apellidos}`}
                      >{`${autor.nombres} ${autor.apellidos}`}</p>
                    ))}
                  </TableCell>
                  <TableCell align="left">
                    <p
                      className={ELLIPSE_CN}
                      title={mapCategory(additional.tipoPrograma)}
                    >
                      {mapCategory(additional.tipoPrograma)}
                    </p>
                    <p className={ELLIPSE_CN}>{additional.descIdioma}</p>
                    <p className={ELLIPSE_CN}>{additional.sala}</p>
                  </TableCell>
                  {/* <TableCell align="left">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-primary"
                      >
                        <Edit />
                        Editar
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-destructive"
                      >
                        <Trash />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      <Button className="mx-4">
        <Plus />
        Añadir programa
      </Button>
    </Card>
  );
};

export default ProgramCard;
