import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SponsorType } from "@/types/sponsorTypes";

// ✅ Esquema de validación con Zod
const SponsorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  foto: z.string().url("Debe ser una URL válida").optional(),
  prefijoIdioma: z.enum(["SP", "EN"], {
    message: "Selecciona un prefijo de idioma válido",
  }),
  descripcionIdioma: z.enum(["ESPAÑOL", "INGLÉS"], {
    message: "Selecciona un idioma válido",
  }),
  url: z.string().url("Debe ser una URL válida"),
  categoria: z.enum(["socio estratégico", "oro", "plata", "cobre", "colaborador", "agradecimiento"], {
    message: "Selecciona una categoría válida",
  }),
});

// ✅ Tipo basado en Zod
type SponsorFormValues = z.infer<typeof SponsorSchema>;

export default function EditSponsorForm({
  onSave,
  onClose,
  sponsor,
}: {
  onSave: (updatedSponsor: SponsorType) => void;
  onClose: () => void;
  sponsor?: SponsorType;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(SponsorSchema),
    defaultValues: {
      nombre: "",
      foto: "",
      prefijoIdioma: "SP",
      descripcionIdioma: "ESPAÑOL",
      url: "",
      categoria: "colaborador",
    },
  });

  const selectedLanguage = watch("prefijoIdioma");

  const onSubmit = (data: SponsorFormValues) => {
    const updatedSponsor: SponsorType = {
      idSponsor: sponsor?.idSponsor || Date.now(),
      ...data,
    };
    onSave(updatedSponsor);
    reset();
    onClose();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-xl">Editar Auspiciador</h2>

        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" {...register("nombre")} />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
        </div>

        <div>
          <Label htmlFor="foto">Imagen (URL)</Label>
          <Input id="foto" {...register("foto")} />
          {errors.foto && <p className="text-red-500 text-sm">{errors.foto.message}</p>}
        </div>

        <div>
          <Label htmlFor="url">Enlace</Label>
          <Input id="url" {...register("url")} />
          {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
        </div>

        {/* Selector de idioma */}
        <div>
          <Label>Idioma</Label>
          <RadioGroup {...register("prefijoIdioma")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SP" id="SP" checked={selectedLanguage === "SP"} />
              <Label htmlFor="SP">Español</Label>
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

        {/* Selector de categoría */}
        <div>
          <Label htmlFor="categoria">Categoría</Label>
          <select id="categoria" {...register("categoria")} className="w-full border p-2 rounded">
            {["socio estratégico", "oro", "plata", "cobre", "colaborador", "agradecimiento"].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && <p className="text-red-500 text-sm">{errors.categoria.message}</p>}
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
