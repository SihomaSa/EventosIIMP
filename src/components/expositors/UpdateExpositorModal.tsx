import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpositorType } from "@/types/expositorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const expositorSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  hojavida: z.string().url("Debe ser una URL válida"),
  image: z.string().url("Debe ser una URL válida").optional(),
});

type ExpositorFormValues = z.infer<typeof expositorSchema>;

interface UpdateExpositorModalProps {
  onUpdate: (updated: ExpositorType) => void;
  onClose: () => void;
  expositor: ExpositorType;
  open: boolean;
}

export default function UpdateExpositorModal({ onClose, expositor, onUpdate, open }: UpdateExpositorModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpositorFormValues>({
    resolver: zodResolver(expositorSchema),
    defaultValues: {
      nombres: expositor.nombres,
      apellidos: expositor.apellidos,
      especialidad: expositor.especialidad,
      hojavida: expositor.hojavida,
      image: expositor.image,
    },
  });

  const onSubmit = (data: ExpositorFormValues) => {
    const updatedExpositor: ExpositorType = { ...expositor, ...data };
    onUpdate(updatedExpositor);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Expositor</DialogTitle>
        </DialogHeader>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <h2 className="text-xl">Editar Expositor</h2>

            <div>
              <Label htmlFor="nombres" className="mb-2">Nombres</Label>
              <Input id="nombres" {...register("nombres")} />
              {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres.message}</p>}
            </div>

            <div>
              <Label htmlFor="apellidos" className="mb-2">Apellidos</Label>
              <Input id="apellidos" {...register("apellidos")} />
              {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos.message}</p>}
            </div>

            <div>
              <Label htmlFor="especialidad" className="mb-2">Especialidad</Label>
              <Input id="especialidad" {...register("especialidad")} />
              {errors.especialidad && <p className="text-red-500 text-sm">{errors.especialidad.message}</p>}
            </div>

            <div>
              <Label htmlFor="hojavida" className="mb-2">Hoja de Vida (URL)</Label>
              <Input id="hojavida" {...register("hojavida")} />
              {errors.hojavida && <p className="text-red-500 text-sm">{errors.hojavida.message}</p>}
            </div>

            <div>
              <Label htmlFor="image" className="mb-2">Imagen (URL)</Label>
              <Input id="image" {...register("image")} />
              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
