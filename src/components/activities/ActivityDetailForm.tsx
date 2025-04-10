import React, { FormEvent, useState } from "react";
import { ActivityDetail } from "@/types/activityTypes";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  ChevronsUpDown,
  MapPin,
  Clock,
  Globe,
  User,
  Trash2,
  Edit,
  Calendar,
  BookOpen,
} from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog ";
import { deleteActivity } from "@/components/services/activitiesServicec";

interface ActivityDetailFormProps {
  details: ActivityDetail;
  onDelete: () => void;
  handleChange: (field: keyof ActivityDetail, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ActivityDetailForm: React.FC<ActivityDetailFormProps> = ({
  details,
  onDelete,
  // handleChange,
  handleSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin asignar";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Format time from ISO string to HH:MM
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Sin asignar";
    return timeString.includes("T")
      ? timeString.split("T")[1].substring(0, 5)
      : timeString.substring(0, 5);
  };

  const handleDelete = async () => {
    try {
      await deleteActivity(details.idActividad);
      onDelete();
      return Promise.resolve();
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      return Promise.reject(error);
    }
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 p-0 gap-0">
          <CollapsibleTrigger asChild className="w-full">
            <CardHeader className="p-3 bg-primary text-white rounded-t-lg flex justify-between items-center cursor-pointer group">
              <div className="flex flex-col space-y-1 flex-1 overflow-hidden">
                <h3 className="text-sm font-semibold uppercase tracking-wide group-hover:text-white/90 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                  {details.desTipoActividad}
                </h3>
                {details.titulo && (
                  <p className="text-xs font-normal text-white/90 truncate">
                    {details.titulo}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 ml-2">
                <ChevronsUpDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent className="animate-collapsible-down">
            <CardContent className="p-3 bg-white">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col w-full gap-2">
                  {/* Title */}
                  {details.titulo && (
                    <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                      <Label
                        htmlFor="titulo"
                        className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                      >
                        <BookOpen
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="truncate">Título</span>
                      </Label>
                      <Input
                        id="titulo"
                        value={details.titulo}
                        disabled
                        className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                      />
                    </div>
                  )}

                  {/* Activity Type */}
                  <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                    <Label
                      htmlFor="desTipoActividad"
                      className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                    >
                      <BookOpen
                        size={14}
                        className="text-primary flex-shrink-0"
                      />
                      <span className="truncate">Tipo de Actividad</span>
                    </Label>
                    <Input
                      id="desTipoActividad"
                      value={details.desTipoActividad}
                      disabled
                      className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                    />
                  </div>

                  {/* Responsable */}
                  {details.responsable && (
                    <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                      <Label
                        htmlFor="responsable"
                        className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                      >
                        <User
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="truncate">Responsable</span>
                      </Label>
                      <Input
                        id="responsable"
                        value={details.responsable}
                        disabled
                        className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                      />
                    </div>
                  )}

                  {/* Location */}
                  {details.lugar && (
                    <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                      <Label
                        htmlFor="lugar"
                        className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                      >
                        <MapPin
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="truncate">Lugar</span>
                      </Label>
                      <Input
                        id="lugar"
                        value={details.lugar}
                        disabled
                        className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                      />
                    </div>
                  )}

                  {/* Start and End Date */}
                  {(details.fechaIni || details.fechaFin) && (
                    <div className="grid grid-cols-2 gap-2">
                      {details.fechaIni && (
                        <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                          <Label
                            htmlFor="fechaIni"
                            className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                          >
                            <Calendar
                              size={14}
                              className="text-primary flex-shrink-0"
                            />
                            <span className="truncate">Fecha Inicio</span>
                          </Label>
                          <Input
                            id="fechaIni"
                            value={formatDate(details.fechaIni)}
                            disabled
                            className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                          />
                        </div>
                      )}
                      {details.fechaFin && (
                        <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                          <Label
                            htmlFor="fechaFin"
                            className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                          >
                            <Calendar
                              size={14}
                              className="text-primary flex-shrink-0"
                            />
                            <span className="truncate">Fecha Fin</span>
                          </Label>
                          <Input
                            id="fechaFin"
                            value={formatDate(details.fechaFin)}
                            disabled
                            className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Start and End Time */}
                  {(details.horaIni || details.horaFin) && (
                    <div className="grid grid-cols-2 gap-2">
                      {details.horaIni && (
                        <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                          <Label
                            htmlFor="horaIni"
                            className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                          >
                            <Clock
                              size={14}
                              className="text-primary flex-shrink-0"
                            />
                            <span className="truncate">Hora Inicio</span>
                          </Label>
                          <Input
                            id="horaIni"
                            value={formatTime(details.horaIni)}
                            disabled
                            className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                          />
                        </div>
                      )}
                      {details.horaFin && (
                        <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                          <Label
                            htmlFor="horaFin"
                            className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                          >
                            <Clock
                              size={14}
                              className="text-primary flex-shrink-0"
                            />
                            <span className="truncate">Hora Fin</span>
                          </Label>
                          <Input
                            id="horaFin"
                            value={formatTime(details.horaFin)}
                            disabled
                            className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Language */}
                  {details.idioma && (
                    <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                      <Label
                        htmlFor="idioma"
                        className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                      >
                        <Globe
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="truncate">Idioma</span>
                      </Label>
                      <Input
                        id="idioma"
                        value={details.idioma}
                        disabled
                        className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                      />
                    </div>
                  )}

                  {/* Duration (for trips) */}
                  {details.duracion && (
                    <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                      <Label
                        htmlFor="duracion"
                        className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                      >
                        <Clock
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="truncate">Duración</span>
                      </Label>
                      <Input
                        id="duracion"
                        value={details.duracion}
                        disabled
                        className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                      />
                    </div>
                  )}
                </div>
              </form>
            </CardContent>

            <CardFooter className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex justify-between pt-2!">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
                className="cursor-pointer text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-1 transition-colors duration-200"
              >
                <Trash2 size={14} />
                <span className="truncate">Eliminar</span>
              </Button>
              <Button
                size="sm"
                className="cursor-pointer bg-primary hover:bg-primary/90 text-white flex items-center gap-1 transition-colors duration-200"
              >
                <Edit size={14} />
                <span className="truncate">Editar</span>
              </Button>
            </CardFooter>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemName={`La actividad "${
          details.titulo || details.desTipoActividad
        }"`}
      />
    </>
  );
};

export default ActivityDetailForm;
