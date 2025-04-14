import { useState } from "react";
import { Edit, Trash2, Link, Globe, Info, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { PressNoteType } from "@/types/pressNoteTypes";
import { deletePressNote } from "../services/pressNotesService";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog ";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PressCardProps {
  pressNote: PressNoteType;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PressCard({
  pressNote,
  onEdit,
  onDelete,
}: PressCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePressNote(String(pressNote.idPrensa));
      onDelete();
      return Promise.resolve();
    } catch (err) {
      setError("Error al eliminar la nota de prensa");
      console.error(err);
      return Promise.reject(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get language display text
  const getLanguageDisplay = (prefijo: string) => {
    return prefijo === "EN"
      ? "English"
      : prefijo === "SP"
      ? "Español"
      : prefijo;
  };

  return (
    <>
      <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col p-0 gap-0">
        <CardHeader className="p-0">
          <div className="relative w-full h-44">
            <img
              src={pressNote.foto}
              alt={pressNote.titulo}
              className="object-cover w-full h-full rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-primary text-white text-xs rounded-md">
                  {getLanguageDisplay(pressNote.prefijoIdioma)}
                </span>
              </div>
              <h3 className="text-white font-semibold mt-1 line-clamp-2">
                {pressNote.titulo}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 bg-white flex-grow">
          <div className="flex flex-col w-full gap-2">
            {/* Title */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`titulo-${pressNote.idPrensa}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <Info size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Título</span>
              </Label>
              <Input
                id={`titulo-${pressNote.idPrensa}`}
                value={pressNote.titulo || ""}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>

                {/* Date */}
    <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
      <Label
        htmlFor={`fecha-${pressNote.idPrensa}`}
        className="text-xs font-medium flex items-center gap-1 text-primary truncate"
      >
        <CalendarIcon size={14} className="text-primary flex-shrink-0" />
        <span className="truncate">Fecha</span>
      </Label>
      <Input
        id={`fecha-${pressNote.idPrensa}`}
        value={format(new Date(pressNote.fecha), 'PPP', { locale: es })}
        disabled
        className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
      />
    </div>

            {/* URL */}
            {pressNote.url && (
              <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
                <Label
                  htmlFor={`url-${pressNote.idPrensa}`}
                  className="text-xs font-medium flex items-center gap-1 text-primary truncate"
                >
                  <Link size={14} className="text-primary flex-shrink-0" />
                  <span className="truncate">URL</span>
                </Label>
                <div className="flex items-center">
                  <Input
                    id={`url-${pressNote.idPrensa}`}
                    value={pressNote.url}
                    disabled
                    className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                  />
                  <a
                    href={pressNote.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Link size={14} />
                  </a>
                </div>
              </div>
            )}

            {/* Language */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`idioma-${pressNote.idPrensa}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <Globe size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Idioma</span>
              </Label>
              <Input
                id={`idioma-${pressNote.idPrensa}`}
                value={getLanguageDisplay(pressNote.prefijoIdioma)}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-3 py-2! bg-gray-50 border-t border-gray-100 flex justify-between">
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
            onClick={onEdit}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white flex items-center gap-1 transition-colors duration-200"
          >
            <Edit size={14} />
            <span className="truncate">Editar</span>
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemName={`la nota de prensa "${pressNote.titulo}"`}
      />

      {error && (
        <div className="bg-red-50 text-red-500 p-2 mt-2 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}
    </>
  );
}
