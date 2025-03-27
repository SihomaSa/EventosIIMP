import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { NewBulletinRequestType } from "@/types/bulletinTypes";

import { useRef, useState } from "react";
import { createBulletin } from "../services/bulletinsService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";
import { ImagePlus } from "lucide-react";
import { LanguageType } from "@/types/languageTypes";

// ✅ Esquema de validación con Zod
const BulletinSchema = z.object({
	titulo: z.string().min(1, "El título es obligatorio"),
	descripcion: z.string().min(1, "La descripción es obligatoria"),
	url: z.string().url("Debe ser una URL válida"),
	foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
	idioma: z.enum(["1", "2"], {
		message: "Selecciona un idioma válido",
	}),
});

// ✅ Tipo basado en Zod
type BulletinFormValues = z.infer<typeof BulletinSchema>;

export default function EditBulletinForm({
	onAdd,
	onClose,
}: {
	onAdd: () => void;
	onClose: () => void;
}) {
	const { selectedEvent } = useEventStore();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<BulletinFormValues>({
		resolver: zodResolver(BulletinSchema),
		defaultValues: {
			titulo: "",
			descripcion: "",
			url: "",
			foto: undefined,
			idioma: "2",
		},
	});

	// Verificar el idioma seleccionado
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
	const handleLanguageChange = (value: LanguageType) => {
		setValue("idioma", value, { shouldValidate: true });
	};

	const onSubmit = async (data: BulletinFormValues) => {
		if (selectedEvent) {
			try {
				const base64Image = await fileToBase64(data.foto);
				const newBulletin: NewBulletinRequestType = {
					titulo: data.titulo,
					descripcion: data.descripcion,
					url: data.url,
					evento: String(selectedEvent.idEvent),
					tipoprensa: "1",
					foto: base64Image,
					idioma: data.idioma,
				};

				await createBulletin(newBulletin);
				alert("Boletin creado exitosamente"); // TODO cambiar por un toast
				onAdd();
				reset(); // Resetea el formulario
				onClose(); // Cierra el modal
				setPreview(null);
			} catch (error) {
				console.error("Error al convertir imagen", error);
			}
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
				<h2 className="text-xl">Nueva Boletín</h2>

				<div>
					<Label htmlFor="titulo" className="mb-2">
						Título
					</Label>
					<Input id="titulo" {...register("titulo")} />
					{errors.titulo && (
						<p className="text-red-500 text-sm">{errors.titulo.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="subtitulo" className="mb-2">
						Subtítulo
					</Label>
					<Input id="subtitulo" {...register("descripcion")} />
					{errors.descripcion && (
						<p className="text-red-500 text-sm">{errors.descripcion.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="descripcion" className="mb-2">
						Descripción
					</Label>
					<Input id="descripcion" {...register("descripcion")} />
					{errors.descripcion && (
						<p className="text-red-500 text-sm">{errors.descripcion.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="url" className="mb-2">
						Enlace
					</Label>
					<Input id="url" {...register("url")} />
					{errors.url && (
						<p className="text-red-500 text-sm">{errors.url.message}</p>
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

				{/* Selector de idioma */}
				<div>
					<Label htmlFor="idioma" className="mb-2">
						Idioma
					</Label>
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
	);
}
