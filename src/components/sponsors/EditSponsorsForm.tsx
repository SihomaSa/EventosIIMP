import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SponsorType } from "../../types/sponsorTypes";

// ✅ Esquema de validación con Zod
const sponsorSchema = z.object({
	nombre: z.string().min(1, "El nombre es obligatorio"),
	image: z.string().url("Debe ser una URL válida"),
	prefijoIdioma: z.string().min(2, "Debe tener al menos 2 caracteres"),
	descripcionIdioma: z.enum(["ES", "EN"], {
		message: "Selecciona un idioma válido",
	}),
	url: z.string().url("Debe ser una URL válida"),
	categoria: z.enum(
		[
			"socio estratégico",
			"oro",
			"plata",
			"cobre",
			"colaborador",
			"agradecimiento",
		],
		{
			message: "Selecciona una categoría válida",
		}
	),
});

// ✅ Tipo basado en Zod
type SponsorFormValues = z.infer<typeof sponsorSchema>;

export default function EditSponsorsModal({
	onAdd,
	open,
	onClose,
}: {
	onAdd: (newSponsor: SponsorType) => void;
	open: boolean;
	onClose: () => void;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<SponsorFormValues>({
		resolver: zodResolver(sponsorSchema),
		defaultValues: {
			nombre: "",
			image: "",
			prefijoIdioma: "es",
			descripcionIdioma: "ES",
			url: "",
			categoria: "socio estratégico", // Categoría por defecto válida
		},
	});


	const onSubmit = (data: SponsorFormValues) => {
		const newSponsor: SponsorType = {
			idSponsor: crypto.randomUUID(),
			nombre: data.nombre,
			image: data.image,
			prefijoIdioma: data.descripcionIdioma.toLowerCase(),
			descripcionIdioma: data.descripcionIdioma,
			url: data.url,
			categoria: data.categoria, // Debe ser un valor de SponsorCategory
		};

		onAdd(newSponsor);
		reset(); // Resetea el formulario
		onClose(); // Cierra el modal
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Agregar Publicidad</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<Label htmlFor="foto">Imagen (URL)</Label>
						<Input id="foto" {...register("image")} />
						{errors.image && (
							<p className="text-red-500 text-sm">{errors.image.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="url">Enlace</Label>
						<Input id="url" {...register("url")} />
						{errors.url && (
							<p className="text-red-500 text-sm">{errors.url.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="descripcionIdioma">Idioma</Label>
						<select
							id="descripcionIdioma"
							{...register("descripcionIdioma")}
							className="w-full border p-2 rounded-md"
						>
							<option value="ES">Español</option>
							<option value="EN">Inglés</option>
						</select>
						{errors.descripcionIdioma && (
							<p className="text-red-500 text-sm">
								{errors.descripcionIdioma.message}
							</p>
						)}
					</div>

					<div>
						<Label htmlFor="categoria">Categoría</Label>
						<select
							id="categoria"
							{...register("categoria")}
							className="w-full border p-2 rounded-md"
						>
							<option value="socio estratégico">Socio Estratégico</option>
							<option value="oro">Oro</option>
							<option value="plata">Plata</option>
							<option value="cobre">Cobre</option>
							<option value="colaborador">Colaborador</option>
							<option value="agradecimiento">Agradecimiento</option>
						</select>
						{errors.categoria && (
							<p className="text-red-500 text-sm">{errors.categoria.message}</p>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancelar
						</Button>
						<Button type="submit">Guardar</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
