import { FC, useState } from "react";
import { Program, ProgramCategory, ProgramDetail } from "../../types/Program";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {Table,TableBody,TableCell,TableHead, TableHeader,TableRow,} from "@/components/ui/table";
import { parseHourRange } from "./utils/parseHourRange";
import { Button } from "@/components/ui/button";
import { Trash,ChevronDown, Clock,Users,Info,ChevronUp,Calendar} from "lucide-react";
import ProgramsService from "../../services/ProgramsService";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { toast } from "sonner";
import AddProgramDialog from "../../../../components/programs/AddProgramDialog";
import EditProgramDetailDialog from "../../../../components/programs/EditProgramDetailDialog";
type AutorWithNumberId = {
  idAutor: number;
  nombres: string;
  apellidos: string;
  [key: string]: string | number;
};
// Define the Autor type with string id (for EditProgramDetailDialog)
type AutorWithStringId = {
  idAutor: string;
  nombres: string;
  apellidos: string;
  [key: string]: string | number;
};
type Props = {
  program: Program;
  programDetail: ProgramDetail;
  programCategories: ProgramCategory[];
  date: string;
  
  onDeleteSuccess?: () => void;
};
const ProgramCard: FC<Props> = ({
  program,
  programCategories,
  date,
  onDeleteSuccess,
}) => {
  const [expandedDetails, setExpandedDetails] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    idProDetalle: number;
    descripcionBody: string;
  } | null>(null);

  function formatDate(dateString: string): string {
    try {
      const date = new Date(`${dateString}T12:00:00`);
      return format(date, "EEEE d 'de' MMMM, yyyy", { locale: es });
    } catch (e) {
      console.warn("Error parsing date:", e);
      return dateString;
    }
  }

  function toggleDetails(id: number) {
    setExpandedDetails((prev) =>
      prev.includes(id)
        ? prev.filter((detailId) => detailId !== id)
        : [...prev, id]
    );
  }

  function mapCategory(id: number) {
    const category = programCategories.find(
      (category) => category.idTipoPrograma === id
    );
    return category ? category.descripcion : `ID-${id}`;
  }

  
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
  
    try {
      const currentDetail = program.detalles[0];
      const totalActividades = currentDetail.detalleAdicional.length;
  
      // ✅ Aquí usas la función centralizada
      await ProgramsService.deleteDetailOrFullProgram(
        currentDetail.idPrograma,
        itemToDelete.idProDetalle,
        totalActividades
      );
  
      // Mensaje dinámico
      toast.success(
        totalActividades === 1 ? "Programa eliminado" : "",
        {
          description:
            totalActividades === 1
              ? `El programa: "${itemToDelete.descripcionBody}" ha sido eliminado con éxito.`
              : "Detalle eliminado exitosamente.",
        }
      );      
  
      // Actualizar vista
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error("Error al eliminar:", error);
      // toast.error("Error al eliminar", {
      //   description:
      //     "No se pudo eliminar el detalle o programa. Intente nuevamente.",
      // });
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  
  
  const handleDeleteClick = (additional: {
    idProDetalle: number;
    descripcionBody: string;
  }) => {
    setItemToDelete({
      idProDetalle: additional.idProDetalle,
      descripcionBody: additional.descripcionBody,
    });
    setIsDeleteDialogOpen(true);
  };
   
  
  // Function to convert autor ids from number to string if needed
  const convertAutorIds = (
    autores: AutorWithNumberId[] | undefined | null
  ): AutorWithStringId[] | undefined => {
    if (!autores) return undefined;
    return autores.map((autor) => ({
      ...autor,
      idAutor: autor.idAutor.toString(), // Convert number to string
    }));
  };

  function handleRefreshPrograms(): void {
    if (onDeleteSuccess) {
      onDeleteSuccess();
    } else {
      console.warn("onDeleteSuccess callback is not provided.");
    }
  }

  return (
    <div className="space-y-4">
      {/* Action buttons outside the card */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={`el programa: "${itemToDelete?.descripcionBody}"`}
      />
      <div className="flex flex-wrap gap-2 justify-start">
        <AddProgramDialog
          programCategories={programCategories}
          date={date}
          programDetail={program.detalles[0]}
          onDeleteSuccess={handleRefreshPrograms}
        />
      </div>
      <Card className="overflow-hidden border-primary/20 shadow-sm py-0">
        {program.detalles.map((detalle) => (
          <div
            key={`card-${program.fechaPrograma}-${detalle.idPrograma}`}
            className="border-b last:border-b-0"
          >
            {/* Program Header */}
            <CardHeader className="py-3 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {formatDate(program.fechaPrograma)}
                  </span>
                </div>
                <h3 className="text-start leading-tight text-md font-bold text-gray-800">
                  {detalle.descripcion}
                </h3>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Large screens - Table View */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-y border-gray-300">
                        <TableHead className="text-center whitespace-nowrap font-semibold truncate">
                          Horario
                        </TableHead>
                        <TableHead className="font-semibold">
                          Descripción
                        </TableHead>
                        <TableHead className="font-semibold">Autores</TableHead>
                        <TableHead className="font-semibold whitespace-nowrap">
                          Detalles
                        </TableHead>
                        <TableHead className="text-center whitespace-nowrap font-semibold">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalle.detalleAdicional.map((additional) => (
                        <TableRow
                          key={`card-${program.fechaPrograma}-${detalle.idPrograma}-${additional.idProDetalle}`}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="text-center font-medium text-primary whitespace-nowrap">
                            {parseHourRange(
                              additional.horaIni,
                              additional.horaFin
                            )}
                          </TableCell>
                          <TableCell
                            align="left"
                            title={additional.descripcionBody}
                            className="max-w-sm"
                          >
                            <div className="font-medium text-gray-800 line-clamp-2">
                              {additional.descripcionBody}
                            </div>
                          </TableCell>
                          <TableCell align="left" className="max-w-xs">
                            {(additional.autores || []).map((autor) => (
                              <p
                                key={`autor-${autor.idAutor}`}
                                className="truncate text-gray-700 text-sm"
                                title={`${autor.nombres} ${autor.apellidos}`}
                              >{`${autor.nombres} ${autor.apellidos}`}</p>
                            ))}
                          </TableCell>
                          <TableCell
                            align="left"
                            className="space-y-1 whitespace-nowrap"
                          >
                            <Badge variant="outline" className="font-medium">
                              {mapCategory(additional.tipoPrograma)}
                            </Badge>
                            {additional.descIdioma && (
                              <p className="text-xs text-gray-600">
                                {additional.descIdioma}
                              </p>
                            )}
                            {additional.sala && (
                              <p className="text-xs text-gray-600">
                                Sala: {additional.sala}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <div className="flex justify-center space-x-1">
                              <EditProgramDetailDialog
                                programDetail={{
                                  ...additional,
                                  autores: convertAutorIds(additional.autores), // Convert IDs to string
                                }}
                                programCategories={programCategories}
                                date={program.fechaPrograma}
                                programDescription={detalle.descripcion}
                                programId={detalle.idPrograma}
                                onUpdateSuccess={onDeleteSuccess}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                onClick={() => handleDeleteClick(additional)}
                              >
                                <Trash size={15} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="block md:hidden">
                {detalle.detalleAdicional.map((additional, index) => (
                  <div
                    key={`mobile-${program.fechaPrograma}-${detalle.idPrograma}-${additional.idProDetalle}`}
                    className={`p-4 ${
                      index !== 0 ? "border-t border-gray-200" : ""
                    }`}
                  >
                    {/* Time and Category with Toggle */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                         <div className="flex items-center gap-2 bg-primary/5 px-2 py-1 rounded-md"> {/*flex items-center gap-2 bg-primary/5 px-2 py-1 rounded-md inline-block */}
                          <Clock
                            size={15}
                            className="text-primary flex-shrink-0"
                          />
                          <span className="font-semibold text-primary">
                            {parseHourRange(
                              additional.horaIni,
                              additional.horaFin
                            )}
                          </span>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-base font-semibold mb-2 text-gray-800">
                            {additional.descripcionBody}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            {mapCategory(additional.tipoPrograma)}
                          </Badge>
                          {additional.descIdioma && (
                            <Badge variant="secondary" className="text-xs">
                              {additional.descIdioma}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <EditProgramDetailDialog
                          programDetail={{
                            ...additional,
                            autores: convertAutorIds(additional.autores), // Convert IDs to string
                          }}
                          programCategories={programCategories}
                          date={program.fechaPrograma}
                          programDescription={detalle.descripcion}
                          programId={detalle.idPrograma}
                          onUpdateSuccess={onDeleteSuccess}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                          onClick={() => handleDeleteClick(additional)}
                        >
                          <Trash size={15} />
                        </Button>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                          onClick={() => toggleDetails(additional.idProDetalle)}
                        >
                          {expandedDetails.includes(additional.idProDetalle) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedDetails.includes(additional.idProDetalle) && (
                      <div className="mt-4 space-y-4 pt-2 bg-gray-50 p-3 rounded-md">
                        {/* Authors */}
                        {additional.autores &&
                          additional.autores.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-700">
                                <Users size={15} className="text-primary" />
                                Autores
                              </h4>
                              <div className="space-y-1 pl-6">
                                {additional.autores.map((autor) => (
                                  <p
                                    key={`mobile-autor-${autor.idAutor}`}
                                    className="text-sm text-gray-600"
                                  >
                                    {`${autor.nombres} ${autor.apellidos}`}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Location */}
                        {additional.sala && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-700">
                              <Info size={15} className="text-primary" />
                              Ubicación
                            </h4>
                            <p className="text-sm text-gray-600 pl-6">
                              Sala: {additional.sala}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default ProgramCard;
