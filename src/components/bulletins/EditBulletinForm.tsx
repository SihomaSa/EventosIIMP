import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { BulletinType } from "@/types/bulletinTypes";

// ✅ Esquema de validación con Zod
const BulletinSchema = z.object({
  descripcion_prensa: z.string().min(1, "La descripción de prensa es obligatoria"),
  descripcionIdioma: z.enum(["SP", "EN"], {
    message: "Selecciona un idioma válido",
  }),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  prefijoIdioma: z.enum(["SP", "EN"], {
    message: "Selecciona un prefijo de idioma válido",
  }),
  idTipPre: z.string().min(1, "El ID del tipo de prensa es obligatorio"),
  url: z.string().url("Debe ser una URL válida"),
  titulo: z.string().min(1, "El título es obligatorio"),
  foto: z.string().url("Debe ser una URL válida"),
  subtitulo: z.string().min(1, "El subtítulo es obligatorio"),
});

// ✅ Tipo basado en Zod
type BulletinFormValues = z.infer<typeof BulletinSchema>;

export default function EditBulletinForm({
  onAdd,
  onClose,
}: {
  onAdd: (newBulletin: BulletinType) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BulletinFormValues>({
    resolver: zodResolver(BulletinSchema),
    defaultValues: {
      descripcion_prensa: "",
      descripcionIdioma: "SP",
      descripcion: "",
      prefijoIdioma: "SP",
      idTipPre: "",
      url: "",
      titulo: "",
      foto: "",
      subtitulo: "",
    },
  });

  // Verificar el idioma seleccionado
  const selectedLanguage = watch("prefijoIdioma");

  const onSubmit = (data: BulletinFormValues) => {
    const newBulletin: BulletinType = {
      descripcion_prensa: data.descripcion_prensa,
      descripcionIdioma: data.descripcionIdioma,
      descripcion: data.descripcion,
      prefijoIdioma: data.prefijoIdioma,
      idTipPre: Date.now().toString(), // ID generado como string
      url: data.url,
      titulo: data.titulo,
      foto: data.foto,
      subtitulo: data.subtitulo,
    };
    onAdd(newBulletin);
    reset();
    onClose();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-xl">Nueva Boletín</h2>

        <div>
          <Label htmlFor="titulo" className="mb-2">
            Título
          </Label>
          <Input id="titulo" {...register("titulo")} />
          {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
        </div>

        <div>
          <Label htmlFor="subtitulo" className="mb-2">
            Subtítulo
          </Label>
          <Input id="subtitulo" {...register("subtitulo")} />
          {errors.subtitulo && <p className="text-red-500 text-sm">{errors.subtitulo.message}</p>}
        </div>

        <div>
          <Label htmlFor="descripcion_prensa" className="mb-2">
            Descripción de prensa
          </Label>
          <Input id="descripcion_prensa" {...register("descripcion_prensa")} />
          {errors.descripcion_prensa && (
            <p className="text-red-500 text-sm">{errors.descripcion_prensa.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="descripcion" className="mb-2">
            Descripción
          </Label>
          <Input id="descripcion" {...register("descripcion")} />
          {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
        </div>

        <div>
          <Label htmlFor="url" className="mb-2">
            Enlace
          </Label>
          <Input id="url" {...register("url")} />
          {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
        </div>

        <div>
          <Label htmlFor="foto" className="mb-2">
            Imagen (URL)
          </Label>
          <Input id="foto" {...register("foto")} />
          {errors.foto && <p className="text-red-500 text-sm">{errors.foto.message}</p>}
        </div>

        {/* Selector de idioma */}
        <div>
          <Label className="mb-2">Idioma</Label>
          <RadioGroup {...register("prefijoIdioma")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ES" id="ES" checked={selectedLanguage === "SP"} />
              <Label htmlFor="ES">Español</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EN" id="EN" checked={selectedLanguage === "EN"} />
              <Label htmlFor="EN">Inglés</Label>
            </div>
          </RadioGroup>
          {errors.prefijoIdioma && (
            <p className="text-red-500 text-sm">{errors.prefijoIdioma.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Card>
  );
}
