import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { NewPressNoteRequestType } from "@/types/pressNoteTypes";
import { createPressNote } from "../services/pressNotesService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";
import { LanguageType } from "@/types/languageTypes";
import { ImageInput } from "../ImageInput";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import {
  X,
  Loader2,
  Upload,
  Link as LinkIcon,
  Languages,
  FileText,
  Image as ImageIcon
} from "lucide-react";

const PressNoteSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  url: z.string().url("Debe ser una URL válida"),
  foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
});

type PressNoteFormValues = z.infer<typeof PressNoteSchema>;

export default function EditPressNoteForm({
  onAdd,
  onClose,
}: {
  onAdd: () => void;
  onClose: () => void;
}) {
  const { selectedEvent } = useEventStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PressNoteFormValues>({
    resolver: zodResolver(PressNoteSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      url: "",
      foto: undefined,
      idioma: "2",
    },
  });

  const handleLanguageChange = (value: LanguageType) => {
    setValue("idioma", value, { shouldValidate: true });
  };

  const selectedLanguage = watch("idioma");

  const onSubmit = async (data: PressNoteFormValues) => {
    if (!selectedEvent) {
      toast.error("No hay un evento seleccionado");
      return;
    }

    try {
      setIsSubmitting(true);
      const base64Image = await fileToBase64(data.foto);

      const newPressNote: NewPressNoteRequestType = {
        titulo: data.titulo,
        subtitulo: data.titulo, // Using title as subtitle as in the original code
        fecha: new Date().toISOString().split("T")[0],
        descripcion: data.descripcion,
        url: data.url,
        evento: String(selectedEvent.idEvent),
        tipoprensa: "1",
        foto: base64Image,
        idioma: data.idioma,
      };

      await createPressNote(newPressNote);
      toast.success("La nota de prensa ha sido creada satisfactoriamente");
      reset();
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error al crear la nota de prensa", error);
      toast.error("Error al crear la nota de prensa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Nueva Nota de Prensa</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="titulo" className="flex items-center gap-2 text-gray-700">
            <FileText size={16} className="text-primary" />
            Título <span className="text-red-500">*</span>
          </Label>
          <Input
            id="titulo"
            {...register("titulo")}
            placeholder="Introduce el título de la nota de prensa"
            className={errors.titulo ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm">{errors.titulo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="url" className="flex items-center gap-2 text-gray-700">
            <LinkIcon size={16} className="text-primary" />
            Enlace <span className="text-red-500">*</span>
          </Label>
          <Input
            id="url"
            {...register("url")}
            placeholder="https://ejemplo.com/nota-de-prensa"
            className={errors.url ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.url && (
            <p className="text-red-500 text-sm">{errors.url.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion" className="flex items-center gap-2 text-gray-700">
            <FileText size={16} className="text-primary" />
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="descripcion"
            {...register("descripcion")}
            placeholder="Describe la nota de prensa"
            className={errors.descripcion ? "border-red-500 focus:ring-red-500" : ""}
            rows={4}
          />
          {errors.descripcion && (
            <p className="text-red-500 text-sm">{errors.descripcion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-gray-700">
            <ImageIcon size={16} className="text-primary" />
            Imagen <span className="text-red-500">*</span>
          </Label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ImageInput
              onChange={(file) => setValue("foto", file, { shouldValidate: true })}
              preview={preview}
              fileName={fileName}
              setPreview={setPreview}
              setFileName={setFileName}
            />
            {errors.foto && (
              <p className="text-red-500 text-sm mt-2">{errors.foto.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-gray-700">
            <Languages size={16} className="text-primary" />
            Idioma <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            onValueChange={handleLanguageChange}
            value={selectedLanguage}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="EN" />
              <Label htmlFor="EN" className="cursor-pointer">Inglés</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="SP" />
              <Label htmlFor="SP" className="cursor-pointer">Español</Label>
            </div>
          </RadioGroup>
          {errors.idioma && (
            <p className="text-red-500 text-sm">{errors.idioma.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}