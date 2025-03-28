import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PressNoteType } from "@/types/pressNoteTypes";
import { useState } from "react";
import { deletePressNote } from "../services/pressNotesService";
import DeleteAlert from "../DeleteAlert";

interface PressNoteCardProps {
  pressNote: PressNoteType;
  openUpdateModal: () => void;
  onDelete: () => void;
}

export default function PressCard({ pressNote, openUpdateModal, onDelete }: PressNoteCardProps) {

  const [error, setError] = useState<string | null>(null);

  const deleteSelectedPressNote = async (id: string) => {
		try {
			await deletePressNote(id);
			onDelete(); 
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			setError("Error al borrar ");
			console.error(error)
		}
	};
  
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
            <DeleteAlert id={String(pressNote.idPrensa)} name="el auspiciador" deleteMethod={() => deleteSelectedPressNote(String(pressNote.idPrensa))} />

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
