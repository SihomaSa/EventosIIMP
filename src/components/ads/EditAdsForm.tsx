import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LanguageType, NewAdRequestType, NewAdType } from "@/types/adTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import { createAd } from "../services/adsService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";

// ✅ Esquema de validación con Zod
const adSchema = z.object({
    foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
    url: z.string().url("Debe ser una URL válida"),
    idioma: z.enum(["1", "2"], {
        message: "Selecciona un idioma válido",
    }),
});

// ✅ Tipo basado en Zod
type AdFormValues = z.infer<typeof adSchema>;

export default function EditAdsModal({
	// onAdd,
	onClose,
}: {
	onAdd: (newAd: NewAdType) => void;
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
        watch
	} = useForm<AdFormValues>({
		resolver: zodResolver(adSchema),
		defaultValues: {
            foto: undefined,
			url: "",
			idioma: "2",
		},
	});

	const [preview, setPreview] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
        console.log("Archivo seleccionado:", file);
		if (file) {
			setPreview(URL.createObjectURL(file));
            setValue("foto", file, { shouldValidate: true });
		}
	};
	const handleLanguageChange = (value: LanguageType) => {
		setValue("idioma", value, { shouldValidate: true });
	};

	const onSubmit = async (data: AdFormValues) => {
        console.log("Datos enviados:", data);
		if (selectedEvent) {
			try {
				const base64Image = await fileToBase64(data.foto);
				const newAd: NewAdRequestType = {
					evento: String(selectedEvent.idEvent),
					foto: base64Image,
					url: data.url,
					idioma: data.idioma,
				};

				await createAd(newAd);
				alert("Ad creado exitosamente"); // TODO cambiar por un toast
				// onAdd(newAd); TODO arreglar el refresh de ads.tsx
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
				<h2 className="text-xl">Nueva publicidad</h2>

				<div>
					<Label htmlFor="foto" className="mb-2">
						Imagen
					</Label>
					<Input
						id="foto"
						type="file"
						accept="image/*"
						onChange={handleImageChange}
					/>
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
					<Label htmlFor="idioma" className="mb-2">
						Idioma
					</Label>
					<RadioGroup onValueChange={handleLanguageChange} value={watch("idioma")}>
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
						<p className="text-red-500 text-sm">
							{errors.idioma.message}
						</p>
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
