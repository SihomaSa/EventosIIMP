import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BulletinType, UpdateBulletinRequestType } from "@/types/bulletinTypes";
import { LanguageType } from "@/types/languageTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useState, useEffect } from 'react';
import { fileToBase64 } from "@/utils/fileToBase64";
import { updateBulletin } from "../services/bulletinsService";


const bulletinSchema = z.object({
  foto: z.instanceof(File).optional(),
  url: z.string().url("Debe ser una URL válida"),
  idioma: z.enum(["1", "2"], { message: "Seleccione un idioma válido" }),
  
  titulo: z.string().min(1, "El título es obligatorio"),
  subtitulo: z.string().min(1, "El subtítulo es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  estado: z
		.number()
		.int()
		.min(0)
		.max(1, { message: "El estado debe ser inactivo o activo" }),
});


type BulletinFormValues = z.infer<typeof bulletinSchema>;

interface UpdateBulletinModalProps {
  onBulletin: () => void;
  onClose: () => void;
  bulletin: BulletinType;
  onUpdate: () => void;
  open: boolean;
}

export default function UpdateBulletinModal({
  onClose,
  bulletin,
	onUpdate,
  open,
}: UpdateBulletinModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fotoUpdated, setFotoUpdated] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BulletinFormValues>({
    resolver: zodResolver(bulletinSchema),
    defaultValues: {
			foto: undefined,
			url: bulletin.url,
			idioma: bulletin.prefijoIdioma === "EN" ? "1" : "2",
			estado: bulletin.estado,
		},
  });

  // Efecto para inicializar los valores cuando cambia el boletín o se abre el modal
  useEffect(() => {
    if (bulletin) {
      console.log("Cargando datos en el formulario:", bulletin);
      setValue("titulo", bulletin.titulo);
      setValue("subtitulo", bulletin.subtitulo);
      setValue("descripcion", bulletin.descripcion_prensa);
		  setValue("url", bulletin.url);
		  setValue("idioma", bulletin.prefijoIdioma === "EN" ? "1" : "2");
		  setValue("estado", bulletin.estado);
		  setImagePreview(bulletin.foto || null);
		}
	  }, [bulletin, setValue]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("foto", file, { shouldValidate: true });
      setFotoUpdated((prev) => prev + 1);
    }
  };

  const handleLanguageChange = (value: LanguageType) => {
    setValue("idioma", value, { shouldValidate: true });
  };

  const onSubmit = async (data: BulletinFormValues) => {
    
    try {

      console.log("Datos antes de enviar:", data);
	  
		  const formFoto =
			fotoUpdated !== 0 && data.foto
			  ? await fileToBase64(data.foto)
			  : bulletin.foto;

      const editBulletin: UpdateBulletinRequestType = {
        idNews: String(bulletin.idPrensa),
        evento: String(bulletin.idTipPre),
        tipoprensa: "2",
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        descripcion: data.descripcion,
        url: data.url,
        foto: formFoto,
        idioma: data.idioma,
        estado: String(data.estado),
      };

      console.log("Actualizando publicidad con:", editBulletin);
      await updateBulletin(editBulletin);
      onUpdate();
      reset();
      onClose();
      setImagePreview(null);
    } catch (error) {
      console.error("Error al actualizar el boletín:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Boletín</DialogTitle>
          <DialogDescription>
					Actualiza los detalles de la bolletín y guarda los cambios.
					</DialogDescription>
        </DialogHeader>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <h2 className="text-xl">Editar Boletín</h2>

            <div>
              <Label htmlFor="titulo" className="mb-2">Título</Label>
              <Input id="titulo" {...register("titulo")} />
              {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
            </div>

            <div>
              <Label htmlFor="subtitulo" className="mb-2">Subtítulo</Label>
              <Input id="subtitulo" {...register("subtitulo")} />
              {errors.subtitulo && <p className="text-red-500 text-sm">{errors.subtitulo.message}</p>}
            </div>

            <div>
              <Label htmlFor="descripcion_prensa" className="mb-2">Descripción de prensa</Label>
              <Input id="descripcion" {...register("descripcion")} />
              {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
            </div>

            <div>
              <Label htmlFor="url" className="mb-2">Enlace</Label>
              <Input id="url" {...register("url")} />
              {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
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
							/>
							{imagePreview && (
								<img
									src={imagePreview}
									alt="Vista previa"
									className="mt-2 max-w-xs rounded"
								/>
							)}
						</div>
            <div>
							<Label className="mb-2 font-bold">Idioma</Label>
							<RadioGroup
								onValueChange={handleLanguageChange}
								value={watch("idioma")}
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
            
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}