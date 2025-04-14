import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdType, UpdateAdRequestType } from "@/types/adTypes";
import { LanguageType } from "@/types/languageTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useState, useEffect } from 'react';
import { fileToBase64 } from "@/utils/fileToBase64";
import { updateAd } from "../services/adsService";

const adSchema = z.object({
	foto: z.instanceof(File).optional(),
	url: z.string().url({ message: "Debe ser una URL válida" }),
	idioma: z.enum(["1", "2"], {
		message: "Selecciona un idioma válido",
	}),
	estado: z
		.number()
		.int()
		.min(0)
		.max(1, { message: "El estado debe ser inactivo o activo" }),
});
type AdFormValues = z.infer<typeof adSchema>;
interface UpdateAdsModalProps {
	onAdd: () => void;
	onClose: () => void;
	ad: AdType;
	onUpdate: () => void;
	open: boolean;
}
export default function UpdateAdsModal({
	onClose,
	ad,
	onUpdate,
	open,
}: UpdateAdsModalProps) {
	const [imagePreview, setImagePreview] = useState<string | null>(
		typeof ad.foto === "string" ? ad.foto : null
	);
	const [fotoUpdated, setFotoUpdated] = useState(0);
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
			url: ad.url,
			idioma: ad.prefijoIdioma === "EN" ? "1" : "2",
			estado: ad.estado,
		},
	});

	useEffect(() => {
		if (ad) {
		  console.log("Cargando datos en el formulario:", ad);
		  setValue("url", ad.url);
		  setValue("idioma", ad.prefijoIdioma === "EN" ? "1" : "2");
		  setValue("estado", ad.estado);
		  setImagePreview(ad.foto || null);
		}
	  }, [ad, setValue]);
	
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

	const handleLanguageChange = (value: LanguageType) => {
		setValue("idioma", value, { shouldValidate: true });
	};

	const onSubmit = async (data: AdFormValues) => {
		try {
		  console.log("Datos antes de enviar:", data);
	  
		  const formFoto =
			fotoUpdated !== 0 && data.foto
			  ? await fileToBase64(data.foto)
			  : ad.foto;
	  
		  const editAd: UpdateAdRequestType = {
			foto: formFoto,
			url: data.url,
			idioma: data.idioma,
			evento: String(ad.idEvento),
			estado: String(data.estado),
			idPublicidad: String(ad.idPublicidad), // 📌 Se asegura que `idPublicidad` está presente
		  };
		  console.log("Actualizando publicidad con:", editAd);
		  await updateAd(editAd);
	  
		  
		  onUpdate();
		  reset();
		  onClose();
		  setImagePreview(null);
		} catch (error) {
		  console.error("Error al actualizar publicidad:", error);
		}
	  };

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Publicidad</DialogTitle>
					<DialogDescription>
					Actualiza los detalles de la publicidad y guarda los cambios.
					</DialogDescription>
				</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
								<div>
									<Label htmlFor="url" className="mb-2 font-bold">
										Enlace
									</Label>
									<Input id="url" {...register("url")} />
									{errors.url && (
										<p className="text-red-500 text-sm">{errors.url.message}</p>
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
			</DialogContent>
		</Dialog>
	);
}