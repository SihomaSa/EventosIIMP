import { useState } from "react";
import { Edit } from "lucide-react";
// import { Pencil } from "lucide-react";
import { Card, CardContent ,  CardHeader, CardFooter} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteExpositor } from "../services/expositorsService";
import DeleteAlert from "../DeleteAlert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpositorCardProps {
  // expositor: ExpositorType;
  idAuthor: number;
  nombres: string;
	apellidos: string;
	especialidad: string;
	hojaDeVida: string;
	foto: string;
  openUpdateModal: () => void;
  onDelete: () => void;
}
export default function ExpositorCard({ 
  // expositor, 
  idAuthor,
  nombres,
	apellidos,
	especialidad,
	hojaDeVida,
  foto,
  openUpdateModal,
  onDelete, // <-- valor por defecto si no se pasa
}: ExpositorCardProps) {
  const [error, setError] = useState<string | null>(null);
  
  const deleteSelectedExpositor = async (idAuthor: number) => {
    try {
      await deleteExpositor(idAuthor);
      onDelete();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars 
    } catch (err) {
			setError("Error al borrar ");
			console.error(error)
		}
  };

  return (
    <>
    <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col p-0 gap-0">
        <CardHeader className="p-0">
          <div className="relative w-full h-44 overflow-hidden rounded-t-lg">
            <img
              src={foto}
              alt={`expositor ${idAuthor}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          </div>
        </CardHeader>
        <CardContent className="p-3 bg-white flex-grow">
					<div className="flex flex-col w-full gap-2">
            {/* Nombres*/}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                <Label 
                htmlFor="nombres"
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                >
                  <span className="truncate">Nombres</span>
                </Label>
                <Input 
                  id="nombres" 
                  value={nombres} 
                  disabled 
                  className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                />
            </div>
              {/* Apellidos*/}
              <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                <Label 
                    htmlFor="apellidos"
                    className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                >
                <span className="truncate"> Apellidos</span>
              
                </Label>
                <Input 
                  id="apellidos" 
                  value={apellidos} 
                  disabled 
                  className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                />
            </div>
              {/* Especialidad*/}
              <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                <Label 
                htmlFor="especialidad"
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                
                >
                  Especialidad

                </Label>
                <Input 
                id="especialidad" 
                value={especialidad} 
                disabled 
                className="bg-gray-100"
                />
            </div>
            {/* Hoja de Vida*/}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                <Label 
                htmlFor="hojaDeVida"
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                
                >
                  Hoja de Vida
                </Label>
                <Input 
                id="hojaDeVida" 
                value={hojaDeVida} 
                disabled 
                className="bg-gray-100" 
                />
          </div>
          </div>
        </CardContent>
				<CardFooter className="px-3 py-2! bg-gray-50 border-t border-gray-100 flex justify-between">
            <DeleteAlert 
              id={String(idAuthor)}  
              name="la conferencista" 
              deleteMethod={() => deleteSelectedExpositor(idAuthor)} 
            />
            <Button
                size="sm"
                className="cursor-pointer bg-primary hover:bg-primary/90 text-white flex items-center gap-1 transition-colors duration-200"
                onClick={(event) => {
                event.preventDefault();
                openUpdateModal();
              }}
            >
              <Edit size={14} />
              <span className="truncate">Editar</span>
            </Button>
          {/* {error && <p className="text-red-500">{error}</p>} */}
      </CardFooter>
    </Card>
    </>
  );
}
