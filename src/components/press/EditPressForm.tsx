import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { NewPressNoteRequestType } from "@/types/pressNoteTypes";
import { createPressNote } from "../services/pressNotesService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";
import { LanguageType } from "@/types/languageTypes";
import { ImageInput } from "../ImageInput";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  Link as LinkIcon,
  Languages,
  FileText,
  Image as ImageIcon,
  CalendarIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";

const PressNoteSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  url: z.string().url("Debe ser una URL válida"),
  foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
  idioma: z.enum(["1", "2"], {
    message: "Selecciona un idioma válido",
  }),
  fecha: z.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Seleccione una fecha válida",
  }),
});

type PressNoteFormValues = z.infer<typeof PressNoteSchema>;

export default function EditPressNoteForm({
  onAdd,
  onClose,
  tipoprensa,
}: {
  onAdd: () => void;
  onClose: () => void;
  tipoprensa: number;
}) {
  const { selectedEvent } = useEventStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<PressNoteFormValues>({
    resolver: zodResolver(PressNoteSchema),
    defaultValues: {
      titulo: "",
      url: "",
      foto: undefined,
      idioma: "2",
      fecha: new Date(),
    },
  });

  const handleLanguageChange = (value: LanguageType) => {
    setValue("idioma", value, { shouldValidate: true });
  };

  const selectedLanguage = watch("idioma");

  const onSubmit = async (data: PressNoteFormValues) => {
    if (!selectedEvent) {
      toast.error("No hay un evento seleccionado");
      return;
    }

    try {
      setIsSubmitting(true);
      const base64Image = await fileToBase64(data.foto);
      const newPressNote: NewPressNoteRequestType = {
        titulo: data.titulo,
        url: data.url,
        evento: String(selectedEvent.idEvent),
        tipoprensa: tipoprensa === 2 ? 2 : 1,
        foto: base64Image,
        idioma: data.idioma,
        ...(tipoprensa !== 2 && { fecha: format(data.fecha, "yyyy-MM-dd") }),
      };

      await createPressNote(newPressNote);
      toast.success("La nota de prensa ha sido creada satisfactoriamente");
      reset();
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error al crear la nota de prensa", error);
      toast.error("Error al crear la nota de prensa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b mb-6">
        <DialogTitle className="text-xl font-semibold">
        {tipoprensa === 2
            ? "Agregar Boletin"
            : "Agregar Nota de Prensa"}
        </DialogTitle>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="titulo"
            className="flex items-center gap-2 text-gray-700"
          >
            <FileText size={16} className="text-primary" />
            Título <span className="text-red-500">*</span>
          </Label>
          <Input
            id="titulo"
            {...register("titulo")}
            placeholder="Introduce el título de la nota de prensa"
            className={errors.titulo ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm">{errors.titulo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="url"
            className="flex items-center gap-2 text-gray-700"
          >
            <LinkIcon size={16} className="text-primary" />
            Enlace <span className="text-red-500">*</span>
          </Label>
          <Input
            id="url"
            {...register("url")}
            placeholder="https://ejemplo.com/nota-de-prensa"
            className={errors.url ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.url && (
            <p className="text-red-500 text-sm">{errors.url.message}</p>
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
        {tipoprensa === 2 ? null : (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700">
              <CalendarIcon size={16} className="text-primary" />
              Fecha <span className="text-red-500">*</span>
            </Label>
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
        )}

        <div className="flex flex-col gap-4">
          <Label className="flex items-center gap-2 text-gray-700">
            <Languages size={16} className="text-primary" />
            Idioma <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            onValueChange={handleLanguageChange}
            value={selectedLanguage}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="EN" />
              <Label htmlFor="EN" className="cursor-pointer">
                Inglés
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="SP" />
              <Label htmlFor="SP" className="cursor-pointer">
                Español
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
