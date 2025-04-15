import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ImageInput } from "@/components/ImageInput";
import { createSponsor } from "@/components/services/sponsorsService";
import { getSponsorCategories } from "@/components/services/sponsorCategoriesService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";
import { SponsorCategoryType } from "@/types/sponsorCategoryTypes";
import { LanguageType } from "@/types/languageTypes";

const sponsorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  foto: z
    .instanceof(File)
    .refine(
      (file) =>
        file.size > 0 &&
        ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      {
        message: "Debe seleccionar un archivo válido (JPEG, PNG o SVG)",
      }
    ),
  url: z.string().url("Debe ser una URL válida"),
  categoria: z.string().min(1, "Selecciona una categoría válida"),
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
});

type SponsorFormValues = z.infer<typeof sponsorSchema>;

interface EditSponsorFormProps {
  onAdd: () => void;
  onClose: () => void;
}

export default function EditSponsorForm({
  onAdd,
  onClose,
}: EditSponsorFormProps) {
  const { selectedEvent } = useEventStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      nombre: "",
      foto: undefined,
      url: "",
      categoria: "",
      idioma: "2",
      descripcion: "",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sponsorCategories, setSponsorCategories] = useState<SponsorCategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getSponsorCategories();
        setSponsorCategories(data || []);
      } catch (error) {
        console.error("Error al cargar categorías", error);
        toast.error("Error al cargar categorías de auspiciadores");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const idiomaSeleccionado = watch("idioma");
  const filteredCategories = sponsorCategories.filter(
    (cat) => cat.idIdioma === idiomaSeleccionado
  );

  const onSubmit = async (data: SponsorFormValues) => {
    const toastId = toast.loading("Creando auspiciador...");
    try {
      if (!selectedEvent) {
        throw new Error("No hay evento seleccionado");
      }

      const base64Image = await fileToBase64(data.foto);

      const sponsorData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        foto: base64Image,
        url: data.url,
        idEvento: selectedEvent.idEvent,
        categoria: data.categoria,
        idioma: data.idioma as LanguageType,
      };

      await createSponsor(sponsorData);

      toast.success("Auspiciador creado exitosamente", { id: toastId });
      onAdd();
      reset();
      onClose();
      setPreview(null);
      setFileName(null);
    } catch (error) {
      console.error("Error al crear auspiciador:", error);
      toast.error("Error al crear auspiciador", { id: toastId });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h2 className="text-xl font-bold">Nuevo Auspiciador</h2>

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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loadingCategories || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorías</SelectLabel>
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
            )}
          />
          {loadingCategories && (
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
        <ImageInput
          onChange={(file) => setValue("foto", file, { shouldValidate: true })}
          preview={preview}
          fileName={fileName}
          setPreview={setPreview}
          setFileName={setFileName}
          disabled={isSubmitting}
        />
        {errors.foto && (
          <p className="text-red-500 text-sm">{errors.foto.message}</p>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}