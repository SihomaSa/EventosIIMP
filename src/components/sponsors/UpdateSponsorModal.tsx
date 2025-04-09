import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SponsorType } from "@/types/sponsorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const sponsorSchema = z.object({
	nombre: z.string().min(1, "El nombre es obligatorio"),
	foto: z.string().url("Debe ser una URL válida").optional(),
	prefijoIdioma: z.enum(["SP", "EN"], { message: "Seleccione un idioma válido" }),
	descripcionIdioma: z.enum(["ESPAÑOL", "INGLÉS"], { message: "Seleccione un idioma válido" }),
	url: z.string().url("Debe ser una URL válida"),
	categoria: z.enum(["socio estratégico", "oro", "plata", "cobre", "colaborador", "agradecimiento"], {
	  message: "Seleccione una categoría válida",
	}),
  });


type SponsorFormValues = z.infer<typeof sponsorSchema>;

interface UpdateSponsorModalProps {
  onUpdate: (updated: SponsorType) => void;
  onClose: () => void;
  sponsor: SponsorType;
  open: boolean;
}

export default function UpdateSponsorModal({ onClose, sponsor, onUpdate, open }: UpdateSponsorModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorSchema),
	defaultValues: {
		nombre: sponsor.nombre,
		foto: sponsor.foto || "",
		prefijoIdioma: sponsor.prefijoIdioma as "SP" | "EN",
		descripcionIdioma: sponsor.descripcionIdioma as "ESPAÑOL" | "INGLÉS",
		url: sponsor.url,
		categoria: sponsor.categoria,
	  }
  });

  const onSubmit = (data: SponsorFormValues) => {
    const updatedSponsor: SponsorType = { ...sponsor, ...data };
    onUpdate(updatedSponsor);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Auspiciador</DialogTitle>
        </DialogHeader>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <h2 className="text-xl">Editar Auspiciador</h2>

            <div>
              <Label htmlFor="nombre" className="mb-2">Nombre</Label>
              <Input id="nombre" {...register("nombre")} />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
            </div>

            <div>
              <Label htmlFor="foto" className="mb-2">Imagen (URL)</Label>
              <Input id="foto" {...register("foto")} />
              {errors.foto && <p className="text-red-500 text-sm">{errors.foto.message}</p>}
            </div>

            <div>
              <Label htmlFor="url" className="mb-2">Enlace</Label>
              <Input id="url" {...register("url")} />
              {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
            </div>

            <div>
              <Label className="mb-2">Categoría</Label>
              <Input id="categoria" {...register("categoria")} />
              {errors.categoria && <p className="text-red-500 text-sm">{errors.categoria.message}</p>}
            </div>

            <div>
              <Label className="mb-2">Idioma</Label>
              <RadioGroup defaultValue={sponsor.prefijoIdioma} {...register("prefijoIdioma")}>
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
