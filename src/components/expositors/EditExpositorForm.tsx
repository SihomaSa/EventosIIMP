import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { ImageInput } from "../ImageInput";
import { toast } from "sonner";
import { useEventStore } from "@/stores/eventStore";
import { createExpositor } from "../services/expositorsService";
import { fileToBase64 } from "@/utils/fileToBase64";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Loader2,
  Upload,
  User,
  Award,
  FileText,
  Image as ImageIcon
} from "lucide-react";

// Zod Schema for Expositor
const ExpositorSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  hojaDeVida: z.string().min(1, "La hoja de vida es obligatoria"),
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
});

type ExpositorFormValues = z.infer<typeof ExpositorSchema>;

export default function EditExpositorForm({
  onAdd,
  onClose,
}: {
  onAdd: () => void;
  onClose: () => void;
}) {
  const { selectedEvent } = useEventStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ExpositorFormValues>({
    resolver: zodResolver(ExpositorSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      especialidad: "",
      hojaDeVida: "",
      foto: undefined,
    },
  });

  const onSubmit = async (data: ExpositorFormValues) => {
    if (!selectedEvent) {
      toast.error("No hay un evento seleccionado");
      return;
    }

    try {
      setIsSubmitting(true);
      const base64Image = await fileToBase64(data.foto);
      const expositorData = {
        evento: String(selectedEvent.idEvent),
        nombres: data.nombres,
        apellidos: data.apellidos,
        especialidad: data.especialidad,
        hojaDeVida: data.hojaDeVida,
        foto: base64Image,
      };

      await createExpositor(expositorData);

      toast.success("Conferencista creado exitosamente");
      reset();
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error en el proceso:", {
        error,
        inputData: { ...data, foto: "[BASE64_REDUCIDO]" },
      });
      toast.error(
        error instanceof Error ? error.message : "Error inesperado al procesar"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b mb-6">
        <DialogTitle className="text-xl font-semibold">
          Agregar Nuevo Conferencista
        </DialogTitle>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="nombres"
            className="flex items-center gap-2 text-gray-700"
          >
            <User size={16} className="text-primary" />
            Nombres <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombres"
            {...register("nombres")}
            placeholder="Introduce los nombres del conferencista"
            className={errors.nombres ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.nombres && (
            <p className="text-red-500 text-sm">{errors.nombres.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="apellidos"
            className="flex items-center gap-2 text-gray-700"
          >
            <User size={16} className="text-primary" />
            Apellidos <span className="text-red-500">*</span>
          </Label>
          <Input
            id="apellidos"
            {...register("apellidos")}
            placeholder="Introduce los apellidos del conferencista"
            className={errors.apellidos ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.apellidos && (
            <p className="text-red-500 text-sm">{errors.apellidos.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="especialidad"
            className="flex items-center gap-2 text-gray-700"
          >
            <Award size={16} className="text-primary" />
            Especialidad <span className="text-red-500">*</span>
          </Label>
          <Input
            id="especialidad"
            {...register("especialidad")}
            placeholder="Introduce la especialidad del conferencista"
            className={errors.especialidad ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.especialidad && (
            <p className="text-red-500 text-sm">{errors.especialidad.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="hojaDeVida"
            className="flex items-center gap-2 text-gray-700"
          >
            <FileText size={16} className="text-primary" />
            Hoja de Vida <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="hojaDeVida"
            {...register("hojaDeVida")}
            placeholder="Introduce la hoja de vida del conferencista"
            className={errors.hojaDeVida ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.hojaDeVida && (
            <p className="text-red-500 text-sm">{errors.hojaDeVida.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-gray-700">
            <ImageIcon size={16} className="text-primary" />
            Imagen <span className="text-red-500">*</span>
          </Label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ImageInput
              onChange={(file) =>
                setValue("foto", file, { shouldValidate: true })
              }
              preview={preview}
              fileName={fileName}
              setPreview={setPreview}
              setFileName={setFileName}
            />
            {errors.foto && (
              <p className="text-red-500 text-sm mt-2">{errors.foto.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}