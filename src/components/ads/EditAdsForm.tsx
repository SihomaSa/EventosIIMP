import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { NewAdRequestType } from "@/types/adTypes";
import { LanguageType } from "@/types/languageTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import { createAd } from "../services/adsService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";
import { ImageInput } from "../ImageInput";
import { toast } from "sonner";

// ✅ Esquema de validación con Zod
const adSchema = z.object({
	foto: z
	  .instanceof(File)
	  .refine(
		(file) => file.size > 0 && ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type),
		{ message: "Debe seleccionar un archivo válido (JPEG, PNG o SVG)" }
	  ),
	url: z.string().url("Debe ser una URL válida"),
	idioma: z.enum(["1", "2"], {
	  message: "Selecciona un idioma válido",
	}),
  });

// ✅ Tipo basado en Zod
type AdFormValues = z.infer<typeof adSchema>;

export default function EditAdsModal({
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
		watch,
	} = useForm<AdFormValues>({
		resolver: zodResolver(adSchema),
		defaultValues: {
			foto: undefined,
			url: "",
			idioma: "2",
		},
	});

	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);

	const handleLanguageChange = (value: LanguageType) => {
		setValue("idioma", value, { shouldValidate: true });
	};

	const onSubmit = async (data: AdFormValues) => {
		const toastId = toast.loading("Procesando publicidad...");
		
		try {
		  if (!selectedEvent) {
			throw new Error("No hay evento seleccionado");
		  }
	  
		  // 🔥 Ahora usa `fileToBase64` que ya optimiza SVG antes de convertirlo
		  const base64Image = await fileToBase64(data.foto);
	  
		  const adData = {
			evento: String(selectedEvent.idEvent),
			foto: base64Image,
			url: data.url,
			idioma: data.idioma,
		  };
	  
		  await createAd(adData);
		  
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
				<h2 className="text-xl">Editar publicidad</h2>
				{/* URL */}
				<div>
					<Label htmlFor="url" className="mb-2">
						Enlace
					</Label>
					<Input id="url" {...register("url")} />
					{errors.url && (
						<p className="text-red-500 text-sm">{errors.url.message}</p>
					)}
				</div>
				{/* Imagen */}
				<ImageInput
					onChange={(file) => setValue("foto", file, { shouldValidate: true })}
					preview={preview}
					fileName={fileName}
					setPreview={setPreview}
					setFileName={setFileName}
				/>
				{/* Idioma */}
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