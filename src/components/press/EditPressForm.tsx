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

export default function EditPressNoteForm({
  onAdd,
  onClose,
}: {
  onAdd: (newPressNote: PressNoteType) => void;
  onClose: () => void;
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
      descripcion_prensa: "",
      descripcionIdioma: "ES",
      descripcion: "",
      prefijoIdioma: "ES",
      idTipPre: 1,
      url: "",
      titulo: "",
      foto: undefined,
      subtitulo: "",
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
    const newPressNote: PressNoteType = {
      ...data,
      foto: data.foto ? URL.createObjectURL(data.foto) : "",
    };
    onAdd(newPressNote);
    reset();
    onClose();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-xl">Nueva Nota de Prensa</h2>

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
          <Label htmlFor="descripcion" className="mb-2">Descripción</Label>
          <Input id="descripcion" {...register("descripcion")} />
          {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
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
              <RadioGroupItem value="ES" id="ES" checked={selectedLanguage === "ES"} />
              <Label htmlFor="ES">Español</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EN" id="EN" checked={selectedLanguage === "EN"} />
              <Label htmlFor="EN">Inglés</Label>
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
