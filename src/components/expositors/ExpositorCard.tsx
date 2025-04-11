import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpositorType } from "@/types/expositorTypes";
import { deleteExpositor } from "../services/expositorsService";
import DeleteAlert from "../DeleteAlert";
import { useState } from "react";

interface ExpositorCardProps {
  expositor: ExpositorType;
  openUpdateModal: () => void;
  onDelete: () => void;
}
export default function ExpositorCard({ 
  expositor, 
  openUpdateModal,
  onDelete = () => {}, // <-- valor por defecto si no se pasa
}: ExpositorCardProps) {
  const [error, setError] = useState<string | null>(null);
  
  const deleteSelectedExpositor = async (id: string) => {
    try {
      await deleteExpositor(id);
      onDelete(); 
    } catch (err) {
      setError("Error al borrar");
      console.error(err); // <- ahora sí verás el error real
    }
  };

  return (
    <Card className="shadow-md overflow-hidden p-4 w-80 hover:shadow-2xl transition delay-150 duration-300 ease-in-out hover:scale-110">
      <CardContent>
        <img
          src={expositor.foto}
          alt={`publicidad ${expositor.idAutor}`}
          className="object-cover h-auto max-h-full rounded-md"
        />
        <form className="p-2 space-y-2">
          <div>
            <Label htmlFor="nombres">Nombres</Label>
            <Input id="nombres" value={expositor.nombres} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input id="apellidos" value={expositor.apellidos} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="especialidad">Especialidad</Label>
            <Input id="especialidad" value={expositor.especialidad} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="hojavida">Hoja de Vida</Label>
            <Input id="hojavida" value={expositor.hojavida} disabled className="bg-gray-100" />
          </div>

          <div className="flex justify-between">
            <DeleteAlert 
              id={String(expositor.idAutor)} 
              name="la conferencista" 
              deleteMethod={() => deleteSelectedExpositor(String(expositor.idAutor))} 
            />
            <Button
              onClick={(event) => {
                event.preventDefault();
                openUpdateModal();
              }}
            >
              <Pencil /> Editar
            </Button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
