import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SponsorType, UpdateSponsorRequestType } from "@/types/sponsorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useState, useEffect } from "react";
import { fileToBase64 } from "@/utils/fileToBase64";
import { updateSponsor } from "@/components/services/sponsorsService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const sponsorSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  foto: z.instanceof(File).optional(),
  url: z.string().url({ message: "Debe ser una URL válida" }),
  categoria: z.string().min(1, "Selecciona una categoría válida"),
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
});

type SponsorFormValues = z.infer<typeof sponsorSchema>;

interface UpdateSponsorModalProps {
  onClose: () => void;
  sponsor: SponsorType;
  idEvento?: string;
  onUpdate: () => void;
  open:boolean;
}

export default function UpdateSponsorModal({
 
  onClose,
  sponsor,
  idEvento = "1",
  onUpdate,
  open,
}: UpdateSponsorModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(sponsor.foto || null);
  const [fotoUpdated, setFotoUpdated] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      descripcion: sponsor.descripcionIdioma,
      foto: undefined,
      url: sponsor.url,
      idioma: sponsor.prefijoIdioma === "EN" ? "1" : "2",
      categoria: sponsor.categoria === "ORO" ? "1" : sponsor.categoria === "PLATA" ? "2" : "3",
    },
  });

  useEffect(() => {
    if (sponsor) {
      setValue("url", sponsor.url);
      setValue("idioma", sponsor.prefijoIdioma === "EN" ? "1" : "2");
      setValue("descripcion", sponsor.descripcionIdioma);
      setImagePreview(sponsor.foto || null);
      setValue(
        "categoria",
        sponsor.categoria === "ORO" ? "1" : sponsor.categoria === "PLATA" ? "2" : "3"
      );
    }
  }, [sponsor, setValue]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setImageError("La imagen excede el tamaño máximo permitido de 1MB.");
        setValue("foto", undefined);
        setImagePreview(null);
        event.target.value = "";
        return;
      }
      setImageError(null);
      setImagePreview(URL.createObjectURL(file));
      setValue("foto", file, { shouldValidate: true });
      setFotoUpdated((prev) => prev + 1);
    }
  };

  const handleLanguageChange = (value: "1" | "2") => {
    setValue("idioma", value, { shouldValidate: true });
  };

  const onSubmit = async (data: SponsorFormValues) => {
    setIsSubmitting(true);
    try {
      let fotoBase64 = sponsor.foto;
      if (fotoUpdated > 0 && data.foto) {
        fotoBase64 = await fileToBase64(data.foto);
      }
  
      const editSponsor: UpdateSponsorRequestType = {
        foto: fotoBase64 as string,
        url: data.url,
        categoria: data.categoria,
        descripcion: data.descripcion,
        idioma: data.idioma,
        estado: "1",
        idEvento: String(idEvento), // Asegurar que sea string
        idSponsor: Number(sponsor.idSponsor), // Asegurar que sea number si el backend lo espera así
      };
  
      console.log("Datos a enviar:", editSponsor);
      
      const response = await updateSponsor(editSponsor);
      console.log("Respuesta del servidor:", response);
  
      toast.success("Auspiciador actualizado correctamente");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar auspiciador:", error);
      toast.error("Error al actualizar el auspiciador");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Auspiciador</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del auspiciador y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              {...register("descripcion")}
              disabled={isSubmitting}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm">{errors.descripcion.message}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <Label htmlFor="url">Enlace</Label>
            <Input
              id="url"
              {...register("url")}
              disabled={isSubmitting}
            />
            {errors.url && (
              <p className="text-red-500 text-sm">{errors.url.message}</p>
            )}
          </div>

          {/* Idioma */}
          <div>
            <Label className="mb-2 font-bold">Idioma</Label>
            <RadioGroup
              onValueChange={handleLanguageChange}
              value={watch("idioma")}
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="EN" />
                <Label htmlFor="EN">Inglés</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="SP" />
                <Label htmlFor="SP">Español</Label>
              </div>
            </RadioGroup>
            {errors.idioma && (
              <p className="text-red-500 text-sm">{errors.idioma.message}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <Label>Categoría</Label>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="oro" />
                    <Label htmlFor="oro">ORO</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="plata" />
                    <Label htmlFor="plata">PLATA</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="cobre" />
                    <Label htmlFor="cobre">COBRE</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.categoria && (
              <p className="text-red-500 text-sm">{errors.categoria.message}</p>
            )}
          </div>

          {/* Imagen */}
          <div>
            <Label htmlFor="foto">Imagen</Label>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              disabled={isSubmitting}
            />
            {imageError && (
              <p className="text-red-500 text-sm mt-2">{imageError}</p>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Vista previa"
                className="mt-2 max-w-xs rounded"
              />
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}