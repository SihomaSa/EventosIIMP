import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BulletinType } from "@/types/bulletinTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const bulletinSchema = z.object({
  descripcion_prensa: z.string().min(1, "La descripción de prensa es obligatoria"),
  descripcionIdioma: z.enum(["SP", "EN"], {
    message: "Seleccione un idioma válido",
  }),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  prefijoIdioma: z.enum(["SP", "EN"], {
    message: "Seleccione un prefijo de idioma válido",
  }),
  idTipPre: z.string().min(1, "El ID del tipo de prensa es obligatorio"),
  url: z.string().url("Debe ser una URL válida"),
  titulo: z.string().min(1, "El título es obligatorio"),
  foto: z.string().url("Debe ser una URL válida"),
  subtitulo: z.string().min(1, "El subtítulo es obligatorio"),
});

type BulletinFormValues = z.infer<typeof bulletinSchema>;

interface UpdateBulletinModalProps {
  onUpdate: (updated: BulletinType) => void;
  onClose: () => void;
  bulletin: BulletinType;
  open: boolean;
}

export default function UpdateBulletinModal({ onClose, bulletin, onUpdate, open }: UpdateBulletinModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BulletinFormValues>({
    resolver: zodResolver(bulletinSchema),
    defaultValues: {
      descripcion_prensa: bulletin.descripcion_prensa,
      descripcionIdioma: bulletin.descripcionIdioma,
      descripcion: bulletin.descripcion,
      prefijoIdioma: bulletin.prefijoIdioma,
      idTipPre: bulletin.idTipPre,
      url: bulletin.url,
      titulo: bulletin.titulo,
      foto: bulletin.foto,
      subtitulo: bulletin.subtitulo,
    },
  });

  const onSubmit = (data: BulletinFormValues) => {
    const updatedBulletin: BulletinType = { ...bulletin, ...data };
    onUpdate(updatedBulletin);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Boletín</DialogTitle>
        </DialogHeader>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <h2 className="text-xl">Editar Boletín</h2>

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
              <Label className="mb-2">Idioma</Label>
              <RadioGroup defaultValue={bulletin.prefijoIdioma} {...register("prefijoIdioma")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SP" id="SP" />
                  <Label htmlFor="SP">Español</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EN" id="EN" />
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
      </DialogContent>
    </Dialog>
  );
}
