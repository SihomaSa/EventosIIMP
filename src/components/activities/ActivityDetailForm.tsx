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
} from "lucide-react";

interface ActivityDetailFormProps {
  details: ActivityDetail;
  handleChange: (field: keyof ActivityDetail, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ActivityDetailForm: React.FC<ActivityDetailFormProps> = ({
  details,
  handleChange,
  handleSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 p-0 gap-0">
        <CollapsibleTrigger asChild className="w-full">
          <CardHeader className="p-3 bg-primary text-white rounded-t-lg flex justify-between items-center cursor-pointer group">
            <div className="flex items-center space-x-2 flex-1 overflow-hidden">
              <h3 className="text-sm font-semibold uppercase tracking-wide group-hover:text-white/90 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                {details.desTipoActividad}
              </h3>
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
                {details.responsable && (
                  <>
                    <input
                      type="text"
                      value={details.desTipoActividad}
                      onChange={(e) =>
                        handleChange("desTipoActividad", e.target.value)
                      }
                      hidden
                    />
                    <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                      <Label
                        htmlFor="responsable"
                        className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                      >
                        <User
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="truncate">Responsables</span>
                      </Label>
                      <Input
                        id="responsable"
                        value={details.responsable || "Sin asignar"}
                        disabled
                        className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                      />
                    </div>
                  </>
                )}

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
                      value={details.lugar || "Sin asignar"}
                      disabled
                      className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                    />
                  </div>
                )}

                {details.horaIni && (
                  <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                    <Label
                      htmlFor="horaIni"
                      className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                    >
                      <Clock size={14} className="text-primary flex-shrink-0" />
                      <span className="truncate">Hora de Inicio</span>
                    </Label>
                    <Input
                      id="horaIni"
                      value={
                        details.horaIni
                          ? details.horaIni.split("T")[1]
                          : "Sin asignar"
                      }
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
                      <Clock size={14} className="text-primary flex-shrink-0" />
                      <span className="truncate">Hora de Finalización</span>
                    </Label>
                    <Input
                      id="horaFin"
                      value={
                        details.horaFin
                          ? details.horaFin.split("T")[1]
                          : "Sin asignar"
                      }
                      disabled
                      className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                    />
                  </div>
                )}

                {details.idioma && (
                  <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                    <Label
                      htmlFor="idioma"
                      className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                    >
                      <Globe size={14} className="text-primary flex-shrink-0" />
                      <span className="truncate">Idioma</span>
                    </Label>
                    <Input
                      id="idioma"
                      value={details.idioma || "Sin asignar"}
                      disabled
                      className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                    />
                  </div>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="px-3 py-2! bg-gray-50 border-t border-gray-100 flex justify-between">
            <Button
              variant="outline"
              size="sm"
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
  );
};

export default ActivityDetailForm;
