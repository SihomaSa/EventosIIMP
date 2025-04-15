import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExpositorType,
} from "@/types/expositorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateExpositor } from "../services/expositorsService";
import {
  User,
  Award,
  FileText,
  Image as ImageIcon,
  Upload,
  Loader2,
} from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

const expositorSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  hojaDeVida: z.string().min(1, "La hoja de vida es obligatoria"),
  foto: z.string().optional(),
});

type ExpositorFormValues = z.infer<typeof expositorSchema>;

interface UpdateExpositorModalProps {
  onClose: () => void;
  expositor: ExpositorType;
  onUpdate: () => void;
}

export default function UpdateExpositorModal({
  onClose,
  expositor,
  onUpdate,
}: UpdateExpositorModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    expositor.foto || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ExpositorFormValues>({
    resolver: zodResolver(expositorSchema),
    defaultValues: {
      nombres: expositor.nombres,
      apellidos: expositor.apellidos,
      especialidad: expositor.especialidad,
      hojaDeVida: expositor.hojaVida,
      foto: expositor.foto,
    },
  });

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("foto", base64String, { shouldValidate: true });
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ExpositorFormValues) => {
    try {
      setIsSubmitting(true);
      const isPhotoChanged = data.foto !== expositor.foto;

      await updateExpositor({
        nombres: data.nombres,
        apellidos: data.apellidos,
        especialidad: data.especialidad,
        hojaDeVida: data.hojaDeVida,
        idAuthor: String(expositor.idAutor),
        ...(isPhotoChanged && { foto: data.foto }),
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar expositor:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b mb-6">
        <DialogTitle className="text-xl font-semibold">
          Editar Conferencista
        </DialogTitle>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-6"
      >
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
            className={
              errors.nombres ? "border-red-500 focus:ring-red-500" : ""
            }
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
            className={
              errors.apellidos ? "border-red-500 focus:ring-red-500" : ""
            }
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
            className={
              errors.especialidad ? "border-red-500 focus:ring-red-500" : ""
            }
          />
          {errors.especialidad && (
            <p className="text-red-500 text-sm">
              {errors.especialidad.message}
            </p>
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
            className={
              errors.hojaDeVida ? "border-red-500 focus:ring-red-500" : ""
            }
          />
          {errors.hojaDeVida && (
            <p className="text-red-500 text-sm">{errors.hojaDeVida.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="foto"
            className="flex items-center gap-2 text-gray-700"
          >
            <ImageIcon size={16} className="text-primary" />
            Imagen <span className="text-red-500">*</span>
          </Label>
          <Input
            id="foto"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <div
            onClick={() => document.getElementById('foto')?.click()}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                <ImageIcon className="mr-2" />
                Seleccionar imagen
              </div>
            )}
          </div>
          {errors.foto && (
            <p className="text-red-500 text-sm mt-2">{errors.foto.message}</p>
          )}
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