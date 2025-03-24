import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdType } from "@/types/adTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

// ✅ Esquema de validación con Zod
const adSchema = z.object({
	foto: z.string().url("Debe ser una URL válida"),
	url: z.string().url("Debe ser una URL válida"),
	descripcionIdioma: z.enum(["ES", "EN"], {
		message: "Selecciona un idioma válido",
	}),
	estado: z
		.number()
		.int()
		.min(0)
		.max(1, "El estado debe ser 0 (inactivo) o 1 (activo)"),
});

// ✅ Tipo basado en Zod
type AdFormValues = z.infer<typeof adSchema>;

export default function EditAdsModal({
	onAdd,
	onClose,
}: {
	onAdd: (newAd: AdType) => void;
	open: boolean;
	onClose: () => void;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<AdFormValues>({
		resolver: zodResolver(adSchema),
		defaultValues: {
			foto: "",
			url: "",
			descripcionIdioma: "ES",
			estado: 1, // Activo por defecto
		},
	});

	const onSubmit = (data: AdFormValues) => {
		const newAd: AdType = {
			idPublicidad: Date.now(), // Se genera internamente
			idEvento: 1, // Valor interno, no modificable por el usuario
			foto: data.foto,
			url: data.url,
			descripcionIdioma: data.descripcionIdioma,
			prefijoIdioma: data.descripcionIdioma.toLowerCase(),
			estado: data.estado,
		};
		onAdd(newAd);
		reset(); // Resetea el formulario
		onClose(); // Cierra el modal
	};

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
				<h2 className="text-xl">Nueva publicación</h2>
				<div>
					<Label htmlFor="foto" className="mb-2">
						Imagen (URL)
					</Label>
					<Input id="foto" {...register("foto")} />
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
					<Label htmlFor="descripcionIdioma" className="mb-2">
						Idioma
					</Label>
					<RadioGroup {...register("descripcionIdioma")}>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="SP" id="SP" />
							<Label htmlFor="SP">Español</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="EN" id="EN" />
							<Label htmlFor="EN">Inglés</Label>
						</div>
					</RadioGroup>
					{errors.descripcionIdioma && (
						<p className="text-red-500 text-sm">
							{errors.descripcionIdioma.message}
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
