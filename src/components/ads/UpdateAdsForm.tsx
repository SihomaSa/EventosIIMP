import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdType } from "@/types/adTypes";

const adSchema = z.object({
  foto: z.string().url({ message: "Debe ser una URL válida" }),
  url: z.string().url({ message: "Debe ser una URL válida" }),
  descripcionIdioma: z.enum(["ES", "EN"], { message: "Seleccione un idioma válido" }),
  estado: z.number().int().min(0).max(1, { message: "El estado debe ser 0 (inactivo) o 1 (activo)" }),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function UpdateAdsForm({
  ad,
  onUpdate,
}: {
  ad: AdType;
  onUpdate: (updated: AdType) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      foto: ad.foto,
      url: ad.url,
      descripcionIdioma: ad.descripcionIdioma as "ES" | "EN",
      estado: ad.estado,
    },
  });

  const onSubmit = (data: AdFormValues) => {
    const updatedAd = { ...ad, ...data };
    onUpdate(updatedAd);
  };

  return (
    <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Actualizar Publicidad</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Imagen (URL)</Label>
          <Input {...register("foto")} />
          {errors.foto && <p className="text-red-500 text-sm">{errors.foto.message}</p>}
        </div>
        <div>
          <Label>Enlace</Label>
          <Input {...register("url")} />
          {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
        </div>
        <div>
          <Label>Idioma</Label>
          <Select
            onValueChange={(value: "ES" | "EN") => setValue("descripcionIdioma", value)}
            defaultValue={ad.descripcionIdioma}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ES">Español</SelectItem>
              <SelectItem value="EN">Inglés</SelectItem>
            </SelectContent>
          </Select>
          {errors.descripcionIdioma && <p className="text-red-500 text-sm">{errors.descripcionIdioma.message}</p>}
        </div>
        <div>
          <Label>Estado</Label>
          <Select
            onValueChange={(value: string) => setValue("estado", parseInt(value))}
            defaultValue={String(ad.estado)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Activo</SelectItem>
              <SelectItem value="0">Inactivo</SelectItem>
            </SelectContent>
          </Select>
          {errors.estado && <p className="text-red-500 text-sm">{errors.estado.message}</p>}
        </div>
        <Button type="submit" className="w-full">
          Actualizar
        </Button>
      </form>
    </div>
  );
}
