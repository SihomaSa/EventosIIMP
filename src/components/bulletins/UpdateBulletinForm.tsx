import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BulletinType } from "@/types/bulletinTypes";

const bulletinSchema = z.object({
  title: z.string().min(1, { message: "El título es requerido" }),
  image: z.string().url({ message: "Debe ser una URL válida" }),
  url: z.string().url({ message: "Debe ser una URL válida" }),
  language: z.enum(["ES", "EN"], { message: "Seleccione un idioma válido" }),
});

type BulletinFormValues = z.infer<typeof bulletinSchema>;

export default function UpdateBulletinForm({
  bulletin,
  onUpdate,
}: {
  bulletin: BulletinType;
  onUpdate: (updated: BulletinType) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BulletinFormValues>({
    resolver: zodResolver(bulletinSchema),
    defaultValues: {
      title: bulletin.titulo,
      image: bulletin.foto,
      url: bulletin.url,
      language: bulletin.descripcionIdioma as "ES" | "EN",
    },
  });

  const onSubmit = (data: BulletinFormValues) => {
    const updatedBulletin = { ...bulletin, ...data };
    onUpdate(updatedBulletin);
  };

  return (
    <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Actualizar Boletín</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>ID (No editable)</Label>
          <p className="bg-gray-100 text-gray-500 p-2 rounded">{bulletin.idTipPre}</p>
        </div>
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="image">Imagen (URL)</Label>
          <Input id="image" {...register("image")} />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>
        <div>
          <Label htmlFor="url">Enlace</Label>
          <Input id="url" {...register("url")} />
          {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
        </div>
        <div>
          <Label>Idioma</Label>
          <Select onValueChange={(value: "ES" | "EN") => setValue("language", value)} defaultValue={bulletin.descripcionIdioma}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ES">Español</SelectItem>
              <SelectItem value="EN">Inglés</SelectItem>
            </SelectContent>
          </Select>
          {errors.language && <p className="text-red-500 text-sm">{errors.language.message}</p>}
        </div>
        <Button type="submit" className="w-full">
          Actualizar
        </Button>
      </form>
    </div>
  );
}
