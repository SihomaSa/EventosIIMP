import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { NewExpositorType } from "@/types/expositorTypes";
import { useRef, useState } from "react";
import { createExpositor } from "../services/expositorsService";
import { fileToBase64 } from "@/utils/fileToBase64";
import { ImagePlus } from "lucide-react";
import { Textarea } from "../ui/textarea";

// ✅ Esquema de validación con Zod
const ExpositorSchema = z.object({
	nombres: z.string().min(1, "El nombre es obligatorio"),
	apellidos: z.string().min(1, "El apellido es obligatorio"),
	especialidad: z.string().min(1, "La especialidad es obligatoria"),
	hojaDeVida: z.string().min(1, "La hoja de vida es obligatoria"),
	foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
});

// ✅ Tipo basado en Zods
type ExpositorFormValues = z.infer<typeof ExpositorSchema>;

export default function EditExpositorForm({
	onAdd,
	onClose,
}: {
	onAdd: () => void;
	onClose: () => void;
}) {
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

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		console.log("Archivo seleccionado:", file);
		if (file) {
			setPreview(URL.createObjectURL(file));
			setFileName(file ? file.name : null);
			setValue("foto", file, { shouldValidate: true });
		}
	};

	const onSubmit = async (data: ExpositorFormValues) => {
		try {
			const base64Image = await fileToBase64(data.foto);
			const newExpositor: NewExpositorType = {
				nombres: data.nombres,
				apellidos: data.apellidos,
				especialidad: data.especialidad,
				hojaDeVida: data.hojaDeVida,
				foto: base64Image,
			};
			await createExpositor(newExpositor);
			alert("Conferencista creado exitosamente"); // TODO cambiar por un toast
			onAdd();
			reset();
			onClose();
			setPreview(null);
		} catch (error) {
			console.error("Error al convertir imagen", error);
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
				<h2 className="text-xl">Nuevo Expositor</h2>

				<div>
					<Label htmlFor="nombres" className="mb-2">
						Nombres
					</Label>
					<Input id="nombres" {...register("nombres")} />
					{errors.nombres && (
						<p className="text-red-500 text-sm">{errors.nombres.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="apellidos" className="mb-2">
						Apellidos
					</Label>
					<Input id="apellidos" {...register("apellidos")} />
					{errors.apellidos && (
						<p className="text-red-500 text-sm">{errors.apellidos.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="especialidad" className="mb-2">
						Especialidad
					</Label>
					<Input id="especialidad" {...register("especialidad")} />
					{errors.especialidad && (
						<p className="text-red-500 text-sm">
							{errors.especialidad.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor="hojavida" className="mb-2">
						Hoja de Vida
					</Label>
          <Textarea id="hojavida" {...register("hojaDeVida")} />
					{errors.hojaDeVida && (
						<p className="text-red-500 text-sm">{errors.hojaDeVida.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="foto" className="mb-2">
						Imagen
					</Label>
					<Input
						ref={fileInputRef}
						id="foto"
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleImageChange}
					/>
					{/* Botón personalizado */}
					<Label htmlFor="foto" className="cursor-pointer w-full">
						<Button
							variant="outline"
							size="icon"
							className="w-full flex justify-around"
							onClick={() => fileInputRef.current?.click()}
						>
							<span className="bg-primary-foreground rounded-l-lg w-1/5 h-full flex items-center justify-center">
								<ImagePlus className="" />
							</span>
							<span className="w-full h-full flex items-center justify-center px-2 ">
								{fileName ? fileName : "Seleccione un archivo"}
							</span>
						</Button>
					</Label>
				</div>
				<div>
					{preview && (
						<img
							src={preview}
							alt="Vista previa"
							className="mt-2 w-full h-auto rounded"
						/>
					)}
					{errors.foto && (
						<p className="text-red-500 text-sm">{errors.foto.message}</p>
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
	);
}
