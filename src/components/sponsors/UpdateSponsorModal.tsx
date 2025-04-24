import { useForm} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SponsorType, UpdateSponsorRequestType } from "@/types/sponsorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { fileToBase64 } from "@/utils/fileToBase64";
import { updateSponsor } from "@/components/services/sponsorsService";
import { toast } from "sonner";
import { ImageIcon, Loader2 } from "lucide-react";
import { getSponsorCategories } from "../services/sponsorCategoriesService";
import { SponsorCategoryType } from "@/types/sponsorCategoryTypes";

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
  open: boolean,
}

export default function UpdateSponsorModal({
  onClose,
  sponsor,
  idEvento = "1",
  onUpdate,
  open,
}: UpdateSponsorModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    sponsor.foto || null
  );
  const [fotoUpdated, setFotoUpdated] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sponsorCategories, setSponsorCategories] = useState<SponsorCategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      descripcion: sponsor.nombre,
      foto: undefined,
      url: sponsor.url,
      idioma: sponsor.prefijoIdioma === "EN" ? "1" : "2",
      categoria: String(sponsor.idCategoria || ""),
    },
  });

  // Obtener el valor del idioma seleccionado
  const idiomaSeleccionado = watch("idioma");

  // Cargar las categorías de auspiciadores
  useEffect(() => {
    (async () => {
      try {
        const data = await getSponsorCategories();
        setSponsorCategories(data || []);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtrar categorías según el idioma seleccionado
  const filteredCategories = sponsorCategories.filter(
    (cat) => cat.idIdioma === idiomaSeleccionado
  );
  useEffect(() => {
    if (sponsor) {
      setValue("url", sponsor.url);
      setValue("idioma", sponsor.prefijoIdioma === "EN" ? "1" : "2");
      setValue("descripcion", sponsor.nombre);
      setImagePreview(sponsor.foto || null);
      setValue("categoria", String(sponsor.idCategoria || ""));
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
  const CATEGORY_MAPPING: Record<string, { en: number; es: number }> = {
    "1": { en: 4, es: 1 },  // ORO ↔ GOLD
    "2": { en: 5, es: 2 },  // PLATA ↔ SILVER
    "3": { en: 6, es: 3 },  // COBRE ↔ COPPER
    "4": { en: 4, es: 1 },  // GOLD ↔ ORO
    "5": { en: 5, es: 2 },  // SILVER ↔ PLATA
    "6": { en: 6, es: 3 },  // COPPER ↔ COBRE
  };
  const handleLanguageChange = (value: "1" | "2") => {
    const currentCategory = watch("categoria");
    
    if (currentCategory) {
      const mapping = CATEGORY_MAPPING[currentCategory];
      if (mapping) {
        const newCategoryId = value === "1" ? mapping.en : mapping.es;
        setValue("categoria", String(newCategoryId), { shouldValidate: true });
      }
    }
    
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
        idEvento: String(idEvento),
        idSponsor: Number(sponsor.idSponsor),
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
        <div className="flex items-center justify-between p-4 border-b">

        <DialogTitle className="text-xl font-semibold">Editar Auspiciador</DialogTitle>
        </div>
          <DialogDescription>
            Actualiza los detalles del auspiciador y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} 
        className="space-y-7 p-4">
          {/* Descripción */}
          <div>
            <Label 
              htmlFor="descripcion"
              className="mb-2 font-bold"
            >
              Descripción</Label>
            <Input
              id="descripcion"
              {...register("descripcion")}
              disabled={isSubmitting}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* URL */}
          <div>
            <Label htmlFor="url"
             className="mb-2 font-bold"
            >Enlace</Label>
            <Input id="url" {...register("url")} disabled={isSubmitting} />
            {errors.url && (
              <p className="text-red-500 text-sm">{errors.url.message}</p>
            )}
          </div>

          {/* Idioma */}
          <div>
        <Label>Idioma</Label>
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
            <Label htmlFor="categoria">Categoría</Label>
            <Select
              value={watch("categoria")}
              onValueChange={(value) => setValue("categoria", value, { shouldValidate: true })}
              disabled={isSubmitting || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categoría</SelectLabel>
                  {filteredCategories.map((cat) => (
                    <SelectItem
                      key={cat.idCategoriaAus}
                      value={String(cat.idCategoriaAus)}
                    >
                      {cat.descripcion}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {loading && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Cargando categorías...
              </div>
            )}
            {errors.categoria && (
              <p className="text-red-500 text-sm">{errors.categoria.message}</p>
            )}
          </div>


          {/* Imagen */}
          <div>
            <Label htmlFor="foto"
            className="mb-2 font-bold"
            >Imagen</Label>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              disabled={isSubmitting}
              className="hidden"
            />
              <div
                onClick={() =>
                  !isSubmitting && document.getElementById("foto")?.click()
                }
                className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${
                  !isSubmitting
                    ? "cursor-pointer hover:bg-gray-100"
                    : "opacity-70"
                } transition-colors`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-full h-auto rounded-lg max-h-[200px] object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center text-gray-500 p-6">
                    <ImageIcon className="mr-2" />
                    Seleccionar imagen
                  </div>
                )}

              </div>
        {imageError && (
          <p className="text-red-500 text-sm mt-2">{imageError}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Guardar
        </Button>
      </div>
    </form>
      </DialogContent>
    </Dialog> 
    
  );
}