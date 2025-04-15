import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpositorType, UpdateExpositorRequestType } from "@/types/expositorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useState, useEffect } from 'react';
import { fileToBase64 } from "@/utils/fileToBase64";
import {updateExpositor} from "../services/expositorsService";

const expositorSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  hojaDeVida: z.string().url("Debe ser una URL válida"),
  // image: z.string().url("Debe ser una URL válida").optional(),
  //foto: z.any().optional(),
  foto: z.instanceof(File).optional(),
});

type ExpositorFormValues = z.infer<typeof expositorSchema>;

interface UpdateExpositorModalProps {
  onAdd: () => void;
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
    reset,
    setValue,
  } = useForm<ExpositorFormValues>({
      resolver: zodResolver(expositorSchema),
      defaultValues: {
        nombres: expositor.nombres,
        apellidos: expositor.apellidos,
        especialidad: expositor.especialidad,
        hojaDeVida: expositor.hojaVida,
        foto: undefined,
      },
  });
  useEffect(() => {
		if (expositor) {
		  console.log("Cargando datos en el formulario:", expositor);
		  setValue("nombres", expositor.nombres);
      setValue("apellidos", expositor.apellidos);
      setValue("especialidad", expositor.especialidad);
      setValue("hojaDeVida", expositor.hojaVida);
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

  const onSubmit = async(data: ExpositorFormValues) => {
    try {
		  console.log("Datos antes de enviar:", data);

		  const formFoto =
			fotoUpdated !== 0 && data.foto
			  ? await fileToBase64(data.foto)
			  : expositor.foto;

    // const updatedExpositor: ExpositorType = { ...expositor, ...data };
    const editExpositor: UpdateExpositorRequestType = {
          nombres: data.nombres,
          apellidos: data.apellidos,
          especialidad: data.especialidad,
          hojaDeVida: data.hojaDeVida,
          foto: formFoto,
          idAuthor: expositor.idAuthor,
          };
    console.log("Actualizando expositor con:", editExpositor);
          await updateExpositor(editExpositor);


    onUpdate();
    reset();
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
          <DialogTitle>Editar Expositor</DialogTitle>
          <DialogDescription>
					Actualiza los detalles de los expositores y guarda los cambios.
					</DialogDescription>
        </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div>
              <Label htmlFor="nombres" className="mb-2 font-bold">Nombres</Label>
              <Input id="nombres" {...register("nombres")} />
              {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres.message}</p>}
            </div>
            <div>
              <Label htmlFor="apellidos" className="mb-2 font-bold">Apellidos</Label>
              <Input id="apellidos" {...register("apellidos")} />
              {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos.message}</p>}
            </div>
            <div>
              <Label htmlFor="especialidad" className="mb-2 font-bold">Especialidad</Label>
              <Input id="especialidad" {...register("especialidad")} />
              {errors.especialidad && <p className="text-red-500 text-sm">{errors.especialidad.message}</p>}
            </div>
            <div>
									<Label htmlFor="url" className="mb-2 font-bold">
										Hoja de vida (URL)
									</Label>
									<Input id="url" {...register("hojaDeVida")} />
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
							/>
							{imageError && (
								<p className="text-red-500 text-sm mt-2">{imageError}</p> // ✅ Mensaje de error
							)}
							{imagePreview && (
								<img
									src={imagePreview}
									alt="Vista previa"
									className="mt-2 max-w-xs rounded"
								/>
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
