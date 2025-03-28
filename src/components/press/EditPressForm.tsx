import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { NewPressNoteRequestType } from "@/types/pressNoteTypes";

import { useState } from "react";
import { createPressNote } from "../services/pressNotesService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";
import { LanguageType } from "@/types/languageTypes";
import { ImageInput } from "../ImageInput";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

// ✅ Esquema de validación con Zod
const PressNoteSchema = z.object({
	titulo: z.string().min(1, "El título es obligatorio"),
	descripcion: z.string().min(1, "La descripción es obligatoria"),
	url: z.string().url("Debe ser una URL válida"),
	foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
	idioma: z.enum(["1", "2"], {
		message: "Selecciona un idioma válido",
	}),
});

// ✅ Tipo basado en Zod
type PressNoteFormValues = z.infer<typeof PressNoteSchema>;

export default function EditPressNoteForm({
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
	} = useForm<PressNoteFormValues>({
		resolver: zodResolver(PressNoteSchema),
		defaultValues: {
			titulo: "",
			descripcion: "",
			url: "",
			foto: undefined,
			idioma: "2",
		},
	});

	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);

	const handleLanguageChange = (value: LanguageType) => {
		setValue("idioma", value, { shouldValidate: true });
	};

	const onSubmit = async (data: PressNoteFormValues) => {
		if (selectedEvent) {
			try {
				const base64Image = await fileToBase64(data.foto);
				const newPressNote: NewPressNoteRequestType = {
					titulo: data.titulo,
					subtitulo: data.titulo,
					fecha: new Date().toISOString().split("T")[0],
					descripcion: data.descripcion,
					url: data.url,
					evento: String(selectedEvent.idEvent),
					tipoprensa: "1",
					foto: base64Image,
					idioma: data.idioma,
				};
				await createPressNote(newPressNote);
				toast("La nota de prensa ha sido creada satisfactoriamente ✅");
				onAdd();
				reset();
				onClose();
			} catch (error) {
				console.error("Error al convertir imagen", error);
			}
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
				<h2 className="text-xl">Nueva Nota de Prensa</h2>

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
					<Label htmlFor="url" className="mb-2">
						Enlace
					</Label>
					<Input id="url" {...register("url")} />
					{errors.url && (
						<p className="text-red-500 text-sm">{errors.url.message}</p>
					)}
				</div>
				<div>
					<Label htmlFor="descripcion" className="mb-2">
						Descripción
					</Label>
          <Textarea id="descripcion" {...register("descripcion")} />
					{errors.descripcion && (
						<p className="text-red-500 text-sm">{errors.descripcion.message}</p>
					)}
				</div>


				<ImageInput
					onChange={(file) => setValue("foto", file, { shouldValidate: true })}
					preview={preview}
					fileName={fileName}
					setPreview={setPreview}
					setFileName={setFileName}
				/>

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
