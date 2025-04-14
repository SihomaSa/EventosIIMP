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
import { CalendarIcon, Upload, Loader2, X, AlertCircle } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

// ✅ Esquema de validación con Zod
const PressNoteSchema = z.object({
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
  idTipPre: z.number().int().positive(),
  url: z.string().url("Debe ser una URL válida"),
  titulo: z.string().min(1, "El título es obligatorio"),
  foto: z.instanceof(File).optional(),
  fecha: z.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Seleccione una fecha válida",
  }),
});

// ✅ Tipo basado en Zod
type PressNoteFormValues = z.infer<typeof PressNoteSchema>;

export default function UpdatePressModal({
  onUpdate,
  onClose,
  pressNote,
}: {
  onUpdate: (updated: PressNoteType) => void;
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
    reset,
    watch,
    setValue,
    control,
  } = useForm<PressNoteFormValues>({
    resolver: zodResolver(PressNoteSchema),
    mode: "onSubmit",
    defaultValues: {
      idioma: pressNote.idioma as "1" | "2",
      idTipPre: pressNote.idTipPre,
      url: pressNote.url,
      titulo: pressNote.titulo,
      foto: undefined,
      fecha: pressNote.fecha ? new Date(pressNote.fecha) : new Date(),
    },
  });

  const selectedLanguage = watch("idioma");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("foto", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: PressNoteFormValues) => {
    console.log("Form data:", data);
    try {
      setIsSubmitting(true);

      // Create a copy of the press note to avoid mutation issues
      const updatedPressNote: PressNoteType = {
        ...pressNote,
        idioma: data.idioma,
        url: data.url,
        titulo: data.titulo,
        fecha: format(data.fecha, "yyyy-MM-dd"),
        foto: data.foto ? URL.createObjectURL(data.foto) : pressNote.foto,
      };

      onUpdate(updatedPressNote);
      reset();
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
          Editar Nota de Prensa
        </DialogTitle>
      </div>
      <form
        onSubmit={(e) => {
          console.log("Form submission event triggered");
          console.log("Current form errors:", errors);
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
                      format(value, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(selectedDate) => {
                      onChange(selectedDate);
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
        <div className="space-y-2">
          <Label htmlFor="foto">Imagen</Label>
          <Input
            id="foto"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="mt-2 max-w-xs rounded"
            />
          )}
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
