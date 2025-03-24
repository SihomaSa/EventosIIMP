import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { NewExpositorType } from "@/types/expositorTypes";

// ✅ Esquema de validación con Zod
const ExpositorSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  hojavida: z.string().url("Debe ser una URL válida"),
  image: z.string().url("Debe ser una URL válida").optional(),
});

// ✅ Tipo basado en Zod
type ExpositorFormValues = z.infer<typeof ExpositorSchema>;

export default function EditExpositorForm({
  onAdd,
  onClose,
}: {
  onAdd: (newExpositor: NewExpositorType) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpositorFormValues>({
    resolver: zodResolver(ExpositorSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      especialidad: "",
      hojavida: "",
      image: "",
    },
  });

  const onSubmit = (data: ExpositorFormValues) => {
    const newExpositor: NewExpositorType = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      especialidad: data.especialidad,
      hojavida: data.hojavida,
      image: data.image,
    };
    onAdd(newExpositor);
    reset();
    onClose();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-xl">Nuevo Expositor</h2>

        <div>
          <Label htmlFor="nombres">Nombres</Label>
          <Input id="nombres" {...register("nombres")} />
          {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres.message}</p>}
        </div>

        <div>
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input id="apellidos" {...register("apellidos")} />
          {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos.message}</p>}
        </div>

        <div>
          <Label htmlFor="especialidad">Especialidad</Label>
          <Input id="especialidad" {...register("especialidad")} />
          {errors.especialidad && <p className="text-red-500 text-sm">{errors.especialidad.message}</p>}
        </div>

        <div>
          <Label htmlFor="hojavida">Hoja de Vida (URL)</Label>
          <Input id="hojavida" {...register("hojavida")} />
          {errors.hojavida && <p className="text-red-500 text-sm">{errors.hojavida.message}</p>}
        </div>

        <div>
          <Label htmlFor="image">Imagen (URL) [Opcional]</Label>
          <Input id="image" {...register("image")} />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
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