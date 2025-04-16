import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { PressNoteType } from "@/types/pressNoteTypes";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Upload,
  Loader2,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { updatePressNote } from "../services/pressNotesService";

// ✅ Esquema de validación con Zod
const PressNoteSchema = z.object({
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
  url: z.string().url("Debe ser una URL válida"),
  titulo: z.string().min(1, "El título es obligatorio"),
  foto: z.string().optional(),
  fecha: z
    .date()
    .or(z.string())
    .transform((val) => {
      if (val instanceof Date) {
        return format(val, "yyyy-MM-dd");
      }
      return val;
    })
    .optional(),
});

// ✅ Tipo basado en Zod
type PressNoteFormValues = z.infer<typeof PressNoteSchema>;

export default function UpdatePressModal({
  onUpdate,
  onClose,
  pressNote,
}: {
  onUpdate: () => void;
  onClose: () => void;
  pressNote: PressNoteType;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    pressNote.foto || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<PressNoteFormValues>({
    resolver: zodResolver(PressNoteSchema),
    mode: "onSubmit",
    defaultValues: {
      idioma: pressNote.prefijoIdioma === "EN" ? "1" : "2",
      url: pressNote.url,
      titulo: pressNote.titulo,
      foto: pressNote.foto,
      ...(pressNote.idTipPre !== 2 && { fecha: pressNote.fecha }),
    },
  });

  const selectedLanguage = watch("idioma");

  const formatDateValue = (value: string | Date | undefined | null): string => {
    if (!value) return "";
    if (value instanceof Date) {
      return format(value, "yyyy-MM-dd");
    }
    if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }
      try {
        // Use UTC to prevent timezone issues
        const date = new Date(`${value}T12:00:00Z`);
        if (!isNaN(date.getTime())) {
          return format(date, "yyyy-MM-dd");
        }
      } catch (e) {
        console.error("Failed to parse date value:", value, e);
      }
    }
    return "";
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Store the base64 string instead of the file
        setValue("foto", base64String, { shouldValidate: true });
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PressNoteFormValues) => {
    try {
      setIsSubmitting(true);
      const isPhotoChanged = data.foto !== pressNote.foto;
      const tipoprensa = pressNote.idTipPre;

      await updatePressNote({
        evento: 1,
        idNews: pressNote.idPrensa,
        tipoprensa: tipoprensa,
        ididioma: data.idioma,
        url: data.url,
        titulo: data.titulo,
        ...(tipoprensa !== 2 && { fecha: data.fecha }),
        ...(isPhotoChanged && { foto: data.foto }),
      });

      onUpdate();

      onClose();
    } catch (error) {
      console.error("Error updating press note", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-start justify-between p-4 border-b mb-6">
        <DialogTitle className="text-xl font-semibold">
          {pressNote.idTipPre === 2
            ? "Editar boletin"
            : "Editar nota de prensa"}
        </DialogTitle>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-6"
      >
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            {...register("titulo")}
            className={errors.titulo ? "border-red-500" : ""}
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm">{errors.titulo.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Enlace</Label>
          <Input
            id="url"
            {...register("url")}
            className={errors.url ? "border-red-500" : ""}
          />
          {errors.url && (
            <p className="text-red-500 text-sm">{errors.url.message}</p>
          )}
        </div>
        {pressNote.idTipPre === 2 ? null : (
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Controller
              name="fecha"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        errors.fecha && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? (
                        // Convert the string date value to a Date for display
                        format(
                          typeof value === "string"
                            ? new Date(`${formatDateValue(value)}T12:00:00Z`)
                            : value,
                          "PPP",
                          { locale: es }
                        )
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        typeof value === "string"
                          ? new Date(`${formatDateValue(value)}T12:00:00Z`)
                          : value
                      }
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          const utcDate = new Date(
                            Date.UTC(
                              selectedDate.getFullYear(),
                              selectedDate.getMonth(),
                              selectedDate.getDate(),
                              12,
                              0,
                              0
                            )
                          );
                          onChange(formatDateValue(utcDate));
                        } else {
                          onChange(null);
                        }
                        setDatePickerOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.fecha && (
              <p className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle size={12} className="mr-1" />
                {errors.fecha.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="foto">Imagen</Label>
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
          {errors.foto && (
            <p className="text-red-500 text-sm">{errors.foto.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Label>Idioma</Label>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={(value) => setValue("idioma", value as "1" | "2")}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="radio-ES" />
              <Label htmlFor="radio-ES" className="cursor-pointer">
                Español
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="radio-EN" />
              <Label htmlFor="radio-EN" className="cursor-pointer">
                Inglés
              </Label>
            </div>
          </RadioGroup>
          {errors.idioma && (
            <p className="text-red-500 text-sm">{errors.idioma.message}</p>
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
