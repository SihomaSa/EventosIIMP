import { useState } from "react";
import { Edit, Trash2, User, Award, FileText } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteExpositor } from "../services/expositorsService";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpositorCardProps {
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
  idAuthor,
  nombres,
  apellidos,
  especialidad,
  hojaDeVida,
  foto,
  openUpdateModal,
  onDelete,
}: ExpositorCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteExpositor(idAuthor);
      onDelete();
      return Promise.resolve();
    } catch (err) {
      setError("Error al eliminar el conferencista");
      console.error(err);
      return Promise.reject(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col p-0 gap-0">
        <CardHeader className="p-0">
        <div className="relative w-full min-h-[280px] overflow-hidden rounded-t-lg bg-white"> 
             <img 
             src={foto}
              alt={`expositor ${idAuthor}`}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="text-white font-semibold mt-1 line-clamp-2">
                {nombres} {apellidos}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 bg-white flex-grow">
          <div className="flex flex-col w-full gap-2">
            {/* Nombres */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`nombres-${idAuthor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <User size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Nombres</span>
              </Label>
              <Input
                id={`nombres-${idAuthor}`}
                value={nombres}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>

            {/* Apellidos */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`apellidos-${idAuthor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <User size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Apellidos</span>
              </Label>
              <Input
                id={`apellidos-${idAuthor}`}
                value={apellidos}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>

            {/* Especialidad */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`especialidad-${idAuthor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <Award size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Especialidad</span>
              </Label>
              <Input
                id={`especialidad-${idAuthor}`}
                value={especialidad}
                disabled
                className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
              />
            </div>

            {/* Hoja de Vida */}
            <div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
              <Label
                htmlFor={`hojaDeVida-${idAuthor}`}
                className="text-xs font-medium flex items-center gap-1 text-primary truncate"
              >
                <FileText size={14} className="text-primary flex-shrink-0" />
                <span className="truncate">Hoja de Vida</span>
              </Label>
              <Input
                id={`hojaDeVida-${idAuthor}`}
                value={hojaDeVida}
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
            onClick={openUpdateModal}
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
        itemName={`el conferencista "${nombres} ${apellidos}"`}
      />

      {error && (
        <div className="bg-red-50 text-red-500 p-2 mt-2 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}
    </>
  );
}