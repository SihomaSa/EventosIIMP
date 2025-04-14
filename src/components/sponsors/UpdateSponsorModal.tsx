import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SponsorType, UpdateSponsorRequestType } from "@/types/sponsorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { fileToBase64 } from "@/utils/fileToBase64";
import { updateSponsor } from "@/components/services/sponsorsService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const sponsorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  foto: z.instanceof(File).optional(),
  url: z.string().url({ message: "Debe ser una URL válida" }),
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
  estado: z.enum(["0", "1"], {
    message: "Selecciona un estado válido",
  }),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  categoria: z.string().min(1, "Selecciona una categoría válida"),
});

type SponsorFormValues = z.infer<typeof sponsorSchema>;

interface UpdateSponsorModalProps {
  sponsor: SponsorType;
  onUpdate: () => void;
  onClose: () => void;
}

export default function UpdateSponsorModal({
  sponsor,
  onUpdate,
  onClose,
}: UpdateSponsorModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof sponsor.foto === "string" ? sponsor.foto : null
  );
  const [fotoUpdated, setFotoUpdated] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    // watch,
    control,
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      nombre: sponsor.nombre,
      foto: undefined,
      url: sponsor.url,
      descripcion: sponsor.descripcionIdioma,
      idioma: sponsor.prefijoIdioma === "EN" ? "1" : "2",
      estado: "1",
      categoria: sponsor.categoria === "ORO" ? "1" : sponsor.categoria === "PLATA" ? "2" : "3",
    },
  });

  useEffect(() => {
    if (sponsor) {
      setValue("nombre", sponsor.nombre);
      setValue("url", sponsor.url);
      setValue("descripcion", sponsor.descripcionIdioma);
      setValue("idioma", sponsor.prefijoIdioma === "EN" ? "1" : "2");
      setValue(
        "categoria",
        sponsor.categoria === "ORO" ? "1" : sponsor.categoria === "PLATA" ? "2" : "3"
      );
      setValue("estado", "1");
      setImagePreview(sponsor.foto || null);
    }
  }, [sponsor, setValue]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) { // 2MB max
        setImageError("La imagen excede el tamaño máximo permitido de 2MB.");
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

  const onSubmit = async (data: SponsorFormValues) => {
    setLoading(true);
    const toastId = toast.loading("Actualizando auspiciador...");
    try {
      const formFoto =
        fotoUpdated !== 0 && data.foto
          ? await fileToBase64(data.foto)
          : sponsor.foto;

      const idioma = data.idioma === "1" ? "EN" : "ES";
      const categoria = 
        data.categoria === "1" ? "ORO" : 
        data.categoria === "2" ? "PLATA" : "BRONCE";

      const editSponsor: UpdateSponsorRequestType = {
        
        foto: formFoto,
        url: data.url,
        idEvento: sponsor.idEvento,
        categoria,
        descripcion: data.descripcion,
        idioma: idioma,
        estado: data.estado,
        idSponsor: sponsor.idSponsor,
      };

      await updateSponsor(editSponsor);
      
      toast.success("Auspiciador actualizado correctamente", { id: toastId });
      onUpdate();
      reset();
      onClose();
      setImagePreview(null);
    } catch (error) {
      console.error("Error al actualizar auspiciador:", error);
      toast.error("Error al actualizar auspiciador", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Auspiciador</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del auspiciador y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              {...register("nombre")}
              disabled={isSubmitting}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm">{errors.nombre.message}</p>
            )}
          </div>

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
            <Label>Idioma</Label>
            <Controller
              name="idioma"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="EN" />
                    <Label htmlFor="EN">Inglés</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="ES" />
                    <Label htmlFor="ES">Español</Label>
                  </div>
                </RadioGroup>
              )}
            />
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
                    <RadioGroupItem value="1" id="ORO" />
                    <Label htmlFor="ORO">Oro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="PLATA" />
                    <Label htmlFor="PLATA">Plata</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="BRONCE" />
                    <Label htmlFor="BRONCE">Bronce</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.categoria && (
              <p className="text-red-500 text-sm">{errors.categoria.message}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <Label>Estado</Label>
            <Controller
              name="estado"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="activo" />
                    <Label htmlFor="activo">Activo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="inactivo" />
                    <Label htmlFor="inactivo">Inactivo</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.estado && (
              <p className="text-red-500 text-sm">{errors.estado.message}</p>
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

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading || isSubmitting}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}