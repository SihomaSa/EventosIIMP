import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { useState } from "react";
import { createExpositor } from "../services/expositorsService";
import { fileToBase64 } from "@/utils/fileToBase64";
import { Textarea } from "../ui/textarea";
import { ImageInput } from "../ImageInput";
import { toast } from "sonner";
import { useEventStore } from "@/stores/eventStore";
// ✅ Validación con Zod
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
	open: boolean;
	onClose: () => void;
}) {
	const { selectedEvent } = useEventStore();
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

	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);

	const onSubmit = async (data: ExpositorFormValues) => {
		const toastId = toast.loading("Procesando publicidad...");
		try {
			if (!selectedEvent) {
				throw new Error("No hay evento seleccionado");
			  }
			const base64Image = await fileToBase64(data.foto);
			const adData = {
				evento: String(selectedEvent.idEvent),
				nombres: data.nombres,
				apellidos: data.apellidos,
				especialidad: data.especialidad,
				hojaDeVida: data.hojaDeVida,
				foto: base64Image,
			};
			await createExpositor(adData);
			toast.success("Publicidad creada exitosamente!", { id: toastId });
		  onAdd();
		  reset();
		  onClose();
		  
		} catch (error) {
		  console.error("Error en el proceso:", {
			error,
			inputData: { ...data, foto: "[BASE64_REDUCIDO]" }
		  });
	  
		  toast.error(
			error instanceof Error 
			  ? error.message 
			  : "Error inesperado al procesar",
			{ id: toastId }
		  );
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
				<h2 className="text-xl font-bold">Nuevo Conferencista</h2>

				<div>
					<Label htmlFor="nombres" className="mb-2">Nombres</Label>
					<Input id="nombres" {...register("nombres")} />
					{errors.nombres && (
						<p className="text-red-500 text-sm mt-1">
							{errors.nombres.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor="apellidos" className="mb-2">Apellidos</Label>
					<Input id="apellidos" {...register("apellidos")} />
					{errors.apellidos && (
						<p className="text-red-500 text-sm mt-1">
							{errors.apellidos.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor="especialidad" className="mb-2">Especialidad</Label>
					<Input id="especialidad" {...register("especialidad")} />
					{errors.especialidad && (
						<p className="text-red-500 text-sm mt-1">
							{errors.especialidad.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor="hojaDeVida" className="mb-2">Hoja de Vida</Label>
					<Textarea id="hojaDeVida" {...register("hojaDeVida")} />
					{errors.hojaDeVida && (
						<p className="text-red-500 text-sm mt-1">
							{errors.hojaDeVida.message}
						</p>
					)}
				</div>

				<ImageInput
					onChange={(file) => {
						setValue("foto", file, { shouldValidate: true });
					}}
					preview={preview}
					fileName={fileName}
					setPreview={setPreview}
					setFileName={setFileName}
				/>
				{errors.foto && (
					<p className="text-red-500 text-sm mt-1">{errors.foto.message}</p>
				)}

				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit">Guardar</Button>
				</div>
			</form>
		</Card>
	);
}
