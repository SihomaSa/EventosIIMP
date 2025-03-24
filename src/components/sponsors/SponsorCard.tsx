import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SponsorType } from "@/types/sponsorTypes";

interface SponsorCardProps {
  sponsor: SponsorType;
  openUpdateModal: () => void;
}

export default function SponsorCard({ sponsor, openUpdateModal }: SponsorCardProps) {
  return (
    <Card className="shadow-md overflow-hidden p-4 w-80 hover:shadow-2xl transition delay-150 duration-300 ease-in-out hover:scale-110">
      <CardContent>
        {sponsor.foto && (
          <img
            src={sponsor.foto}
            alt={sponsor.nombre}
            className="object-cover h-15 rounded-md"
          />
        )}
        <form className="p-2 space-y-2">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" value={sponsor.nombre} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input id="descripcion" value={sponsor.descripcionIdioma} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Input id="categoria" value={sponsor.categoria} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={sponsor.url} disabled className="bg-gray-100" />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" disabled>
              <Trash2 /> Eliminar
            </Button>
            <Button
              onClick={(event) => {
                event.preventDefault();
                openUpdateModal();
              }}
            >
              <Pencil /> Editar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}