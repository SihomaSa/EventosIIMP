import { useState } from "react";
import { Edit, User, Award, FileText, Globe } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteExpositor } from "../services/expositorsService";
import DeleteAlert from "../DeleteAlert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpositorCardProps {
  idAutor: number;
  nombres: string;
  apellidos: string;
  especialidad: string;
  hojaDeVida: string;
  descripcionIdioma: string;
  foto: string;
  openUpdateModal: () => void;
  onDelete: () => void;
}

export default function ExpositorCard({
  idAutor,
  nombres,
  apellidos,
  especialidad,
  hojaDeVida,
  descripcionIdioma,
  foto,
  openUpdateModal,
  onDelete,
}: ExpositorCardProps) {
  
  const [error, setError] = useState<string | null>(null);

  const deleteSelectedExpositor = async (idAutor: string) => {
    try {
      
      await deleteExpositor(idAutor);
      onDelete();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error al eliminar el conferencista");
      console.error(error)
    }
  };

  return (
    <>
      <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col p-0 gap-0">
        <CardHeader className="p-0">
          {/* imagen */}
        <div className="relative w-full aspect-[4/4] overflow-hidden rounded-t-lg bg-white">
             <img 
             src={foto}
              alt={`expositor ${idAutor}`}
              className="w-full h-full object-cover object-top"
            />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute bottom-0 left-0 p-3 w-full">
                  <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold mt-1 line-clamp-2">
                {nombres} {apellidos}
                <span className="px-2 py-1 bg-primary text-white text-xs rounded-md">
								{descripcionIdioma}
							</span>
              </h3>
            </div>
          </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 bg-white flex-grow">
          <div className="flex flex-col w-full gap-2">
            {/* Nombres */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`nombres-${idAutor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <User size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Nombres</span>
              </Label>
              <Input
                id={`nombres-${idAutor}`}
                value={nombres}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>

            {/* Apellidos */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`apellidos-${idAutor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <User size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Apellidos</span>
              </Label>
              <Input
                id={`apellidos-${idAutor}`}
                value={apellidos}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>

            {/* Especialidad */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`especialidad-${idAutor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <Award size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Especialidad</span>
              </Label>
              <Input
                id={`especialidad-${idAutor}`}
                value={especialidad}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>
            {/* Language */}
						<div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
							<Label 
								htmlFor="descripcionIdioma"
								className="text-xs font-medium flex items-center gap-1 text-primary truncate"
							  >
								<Globe size={14} className="text-primary flex-shrink-0" />
								<span className="truncate">Idioma</span>
							</Label>
								<Input
								 id="descripcionIdioma"
								 value={descripcionIdioma}
								 disabled
								 className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
							   />
						</div>

            {/* Hoja de Vida */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`hojaDeVida-${idAutor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <FileText size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Hoja de Vida</span>
              </Label>
              <Input
                id={`hojaDeVida-${idAutor}`}
                value={hojaDeVida}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-2! bg-gray-50 border-t border-gray-100 flex justify-between">
            <DeleteAlert 
                      id={String(idAutor)}
                      name="la publicidad" 
                      deleteMethod={() => deleteSelectedExpositor(String(idAutor))} 
                      />
                    <Button
                      size="sm"
                      className="cursor-pointer bg-primary hover:bg-primary/90 text-white flex items-center gap-1 transition-colors duration-200"
                      onClick={(event) => {
                        event.preventDefault(); // Previene la recarga de la página
                        openUpdateModal();
                      }}
                          >
                      <Edit size={14} />
                      <span className="truncate">Editar</span>
                    </Button>
                  </CardFooter>
      </Card>
    </>
  );
}