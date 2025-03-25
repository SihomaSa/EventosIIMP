import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PressNoteType } from "@/types/pressNoteTypes";
import { useState } from "react";

// ✅ Esquema de validación con Zod
const PressNoteSchema = z.object({
  descripcion_prensa: z.string().min(1, "La descripción de prensa es obligatoria"),
  descripcionIdioma: z.enum(["ES", "EN"], {
    message: "Selecciona un idioma válido",
  }),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  prefijoIdioma: z.enum(["ES", "EN"], {
    message: "Selecciona un prefijo de idioma válido",
  }),
  idTipPre: z.number().int().positive(),
  url: z.string().url("Debe ser una URL válida"),
  titulo: z.string().min(1, "El título es obligatorio"),
  foto: z.instanceof(File).optional(),
  subtitulo: z.string().min(1, "El subtítulo es obligatorio"),
});

// ✅ Tipo basado en Zod
type PressNoteFormValues = z.infer<typeof PressNoteSchema>;

export default function UpdatePressModal({
  onUpdate,
  onClose,
  pressNote,
  open,
}: {
  onUpdate: (updated: PressNoteType) => void;
  onClose: () => void;
  pressNote: PressNoteType;
  open: boolean;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PressNoteFormValues>({
    resolver: zodResolver(PressNoteSchema),
    defaultValues: {
      descripcion_prensa: pressNote.descripcion_prensa,
      descripcionIdioma: pressNote.descripcionIdioma,
      descripcion: pressNote.descripcion,
      prefijoIdioma: pressNote.prefijoIdioma,
      idTipPre: pressNote.idTipPre,
      url: pressNote.url,
      titulo: pressNote.titulo,
      foto: undefined,
      subtitulo: pressNote.subtitulo,
    },
  });

  const selectedLanguage = watch("prefijoIdioma");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: PressNoteFormValues) => {
    const updatedPressNote: PressNoteType = {
      ...pressNote,
      ...data,
      foto: data.foto ? URL.createObjectURL(data.foto) : pressNote.foto,
    };
    onUpdate(updatedPressNote);
    reset();
    onClose();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-xl">Editar Nota de Prensa</h2>

        <div>
          <Label htmlFor="titulo" className="mb-2">Título</Label>
          <Input id="titulo" {...register("titulo")} />
          {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
        </div>

        <div>
          <Label htmlFor="subtitulo" className="mb-2">Subtítulo</Label>
          <Input id="subtitulo" {...register("subtitulo")} />
          {errors.subtitulo && <p className="text-red-500 text-sm">{errors.subtitulo.message}</p>}
        </div>

        <div>
          <Label htmlFor="descripcion_prensa" className="mb-2">Descripción de prensa</Label>
          <Input id="descripcion_prensa" {...register("descripcion_prensa")} />
          {errors.descripcion_prensa && <p className="text-red-500 text-sm">{errors.descripcion_prensa.message}</p>}
        </div>

        <div>
          <Label htmlFor="url" className="mb-2">Enlace</Label>
          <Input id="url" {...register("url")} />
          {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
        </div>

        <div>
          <Label htmlFor="foto" className="mb-2">Imagen</Label>
          <Input id="foto" type="file" accept="image/*" onChange={onFileChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Vista previa" className="mt-2 max-w-xs rounded" />
          )}
        </div>

        <div>
          <Label className="mb-2">Idioma</Label>
          <RadioGroup {...register("prefijoIdioma")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem key="ES" value="ES" id="radio-ES" checked={selectedLanguage === "ES"} />
              <Label htmlFor="radio-ES">Español</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem key="EN" value="EN" id="radio-EN" checked={selectedLanguage === "EN"} />
              <Label htmlFor="radio-EN">Inglés</Label>
            </div>
          </RadioGroup>
          {errors.prefijoIdioma && <p className="text-red-500 text-sm">{errors.prefijoIdioma.message}</p>}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Card>
  );
}