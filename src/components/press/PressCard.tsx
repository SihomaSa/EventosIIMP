import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PressNoteType } from "@/types/pressNoteTypes";

interface BulletinCardProps {
  pressNote: PressNoteType;
  openUpdateModal: () => void;
}

export default function PressCard({ pressNote, openUpdateModal }: BulletinCardProps) {
  return (
    <Card className="shadow-md overflow-hidden p-4 w-80 hover:shadow-2xl transition delay-150 duration-300 ease-in-out hover:scale-110">
      <CardContent>
        <img
          src={pressNote.foto}
          alt={pressNote.titulo}
          className="object-cover w-full h-40 rounded-md"
        />
        <form className="p-2 space-y-2">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={pressNote.titulo} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input id="descripcion" value={pressNote.descripcion} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="idioma">Idioma</Label>
            <Input id="idioma" value={pressNote.prefijoIdioma} disabled className="bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={pressNote.url} disabled className="bg-gray-100" />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" disabled>
              <Trash2 /> Eliminar
            </Button>
            <Button
              onClick={(event) => {
                event.preventDefault(); // Previene la recarga de la página
                openUpdateModal();
              }}
            >
              <Pencil />
              Editar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
