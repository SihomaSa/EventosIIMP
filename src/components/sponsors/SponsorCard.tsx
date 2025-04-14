import { useState } from "react";
import { Link as LinkIcon, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DeleteAlert from "@/components/DeleteAlert";
import { deleteSponsor } from "@/components/services/sponsorsService";
import { SponsorType } from "@/types/sponsorTypes";
import { toast } from "sonner";

interface SponsorCardProps {
  sponsor: SponsorType;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SponsorCard({
  sponsor,
  onEdit,
  onDelete,
}: SponsorCardProps) {
  const [error, setError] = useState<string | null>(null);

  const deleteSelectedSponsor = async (id: string) => {
    try {
      await deleteSponsor(id);
      onDelete();
      toast.success("Auspiciador eliminado correctamente");
    } catch (err) {
      setError("Error al borrar el auspiciador");
      toast.error("No se pudo eliminar el auspiciador");
      console.error(err);
    }
  };

  return (
    <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col p-0 gap-0">
      <CardHeader className="p-0">
        <div className="relative w-full h-44 overflow-hidden rounded-t-lg">
          <img
            src={sponsor.foto}
            alt={`auspiciador ${sponsor.idSponsor}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          <div className="absolute bottom-0 left-0 p-3 w-full">
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-primary text-white text-xs rounded-md">
                {sponsor.categoria}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 bg-white flex-grow">
        <div className="flex flex-col w-full gap-2">
          {/* Nombre */}
          <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
            <Label
              htmlFor="nombre"
              className="text-xs font-medium flex items-center gap-1 text-primary truncate"
            >
              <span className="truncate">Nombre</span>
            </Label>
            <Input
              id="nombre"
              value={sponsor.nombre}
              disabled
              className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
            />
          </div>

          {/* Descripción */}
          <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
            <Label
              htmlFor="descripcion"
              className="text-xs font-medium flex items-center gap-1 text-primary truncate"
            >
              <span className="truncate">Descripción</span>
            </Label>
            <Input
              id="descripcion"
              value={sponsor.descripcionIdioma}
              disabled
              className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
            />
          </div>

          {/* URL */}
          <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
            <Label
              htmlFor="url"
              className="text-xs font-medium flex items-center gap-1 text-primary truncate"
            >
              <LinkIcon size={14} className="text-primary flex-shrink-0" />
              <span className="truncate">URL</span>
            </Label>
            <div className="flex items-center">
              <Input
                id="url"
                value={sponsor.url}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:text-primary/80 transition-colors"
              >
                <LinkIcon size={14} />
              </a>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex justify-between">
        <DeleteAlert
          id={String(sponsor.idSponsor)}
          name="el auspiciador"
          deleteMethod={() => deleteSelectedSponsor(String(sponsor.idSponsor))}
        />
        <Button
          size="sm"
          className="cursor-pointer bg-primary hover:bg-primary/90 text-white flex items-center gap-1 transition-colors duration-200"
          onClick={(event) => {
            event.preventDefault();
            onEdit();
          }}
        >
          <Edit size={14} />
          <span className="truncate">Editar</span>
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardFooter>
    </Card>
  );
}