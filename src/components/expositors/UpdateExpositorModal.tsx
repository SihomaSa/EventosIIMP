import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {ExpositorType, UpdateExpositorRequestType} from "@/types/expositorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateExpositor } from "../services/expositorsService";
import {User,Award,FileText} from "lucide-react";
import { LanguageType } from "@/types/languageTypes";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState, useEffect } from "react";
import { fileToBase64 } from "@/utils/fileToBase64";
import { ImageIcon } from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle,DialogDescription} from "../ui/dialog";

const expositorSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  hojaDeVida: z.string().min(1, "La hoja de vida es obligatoria"),
  descripcionIdioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
  foto: z.instanceof(File).optional(),
});

type ExpositorFormValues = z.infer<typeof expositorSchema>;

interface UpdateExpositorModalProps {
 
  onClose: () => void;
  expositor: ExpositorType;
  onUpdate: () => void;
  open: boolean;
}

export default function UpdateExpositorModal({
  onClose,
  expositor,
  onUpdate,
  open,
}: UpdateExpositorModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof expositor.foto === "string" ? expositor.foto : null
  );
  const [fotoUpdated, setFotoUpdated] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExpositorFormValues>({
    resolver: zodResolver(expositorSchema),
    defaultValues: {
      foto: undefined,
      nombres: expositor.nombres,
      apellidos: expositor.apellidos,
      especialidad: expositor.especialidad,
      hojaDeVida: expositor.hojaVida,
      descripcionIdioma: expositor.prefijoIdioma === "EN" ? "1" : "2",
      
    },
  });
  useEffect(() => {
      if (expositor) {
        console.log("Cargando datos en el formulario:", expositor);
        setValue("nombres", expositor.nombres);
        setValue("apellidos", expositor.apellidos);
        setValue("especialidad", expositor.especialidad);
        setValue("hojaDeVida", expositor.hojaVida);
        setValue("descripcionIdioma", expositor.prefijoIdioma === "EN" ? "1" : "2");
        
        setImagePreview(expositor.foto || null);
      }
  }, [expositor, setValue]);

  const [imageError, setImageError] = useState<string | null>(null); // ✅ Error del archivo

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setImageError("La imagen excede el tamaño máximo permitido de 1MB.");
        setValue("foto", undefined); // Limpia el valor del form
        setImagePreview(null); // Limpia la vista previa
        event.target.value = ""; // Resetea el input
        return;
      }
      setImageError(null); // Limpia errores anteriores
      setImagePreview(URL.createObjectURL(file));
      setValue("foto", file, { shouldValidate: true });
      setFotoUpdated((prev) => prev + 1);
    }
  };

  const handleLanguageChange = (value: LanguageType) => {
    setValue("descripcionIdioma", value, { shouldValidate: true });
  };

  const onSubmit = async (data: ExpositorFormValues) => {
    try {
      console.log("Datos antes de enviar:", data);
     
       const formFoto =
        fotoUpdated !== 0 && data.foto
         ? await fileToBase64(data.foto)
         : expositor.foto;
     
        const editExpositor: UpdateExpositorRequestType={
        foto: formFoto,
        nombres: data.nombres,
        apellidos: data.apellidos,
        especialidad: data.especialidad,
        hojaDeVida: data.hojaDeVida,
        descripcionIdioma: data.descripcionIdioma,
        idAuthor: String(expositor.idAutor),
      };
      console.log("Actualizando publicidad con:", editExpositor);
      await updateExpositor(editExpositor);

      onUpdate();
      onClose();
      setImagePreview(null);
    } catch (error) {
      console.error("Error al actualizar expositor:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          Editar Conferencista
        </DialogTitle>
      <DialogDescription>
            Actualiza los detalles de la conferencista y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-4"
      >
        <div>
          <Label
            htmlFor="nombres"
           className="mb-2 font-bold"
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

        <div>
          <Label
            htmlFor="apellidos"
            className="mb-2 font-bold"
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

        <div>
          <Label
            htmlFor="especialidad"
            className="mb-2 font-bold"
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
        <div>
            <Label className="mb-2 font-bold">Idioma</Label>
            <RadioGroup
              onValueChange={handleLanguageChange}
              value={watch("descripcionIdioma")}
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
            {errors.descripcionIdioma && (
              <p className="text-red-500 text-sm">{errors.descripcionIdioma.message}</p>
            )}
          </div>

        <div>
          <Label
            htmlFor="hojaDeVida"
            className="mb-2 font-bold"
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

        <div>
            <Label htmlFor="foto" className="mb-2 font-bold">
              Imagen
            </Label>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <div
              onClick={() => document.getElementById("foto")?.click()}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
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
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
      </Dialog>
  );
}