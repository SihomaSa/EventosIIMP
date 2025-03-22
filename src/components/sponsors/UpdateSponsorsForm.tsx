import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SponsorCategory, SponsorType } from "@/types/sponsorTypes";

export const sponsorSchema = z.object({
	nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
	image: z.string().url({ message: "Debe ser una URL válida" }),
	url: z.string().url({ message: "Debe ser una URL válida" }),
	descripcionIdioma: z.enum(["ES", "EN"], {
		message: "Seleccione un idioma válido",
	}),
	categoria: z.enum(
		[
			"socio estratégico",
			"oro",
			"plata",
			"cobre",
			"colaborador",
			"agradecimiento",
		] as const,
		{ message: "Seleccione una categoría válida" }
	),
});

type SponsorFormValues = z.infer<typeof sponsorSchema>;

export default function UpdateSponsorsForm({
	sponsor,
	onUpdate,
}: {
	sponsor: SponsorType;
	onUpdate: (updated: SponsorType) => void;
}) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<SponsorFormValues>({
		resolver: zodResolver(sponsorSchema),
		defaultValues: {
			image: sponsor.image ?? "", // Ahora coincide con SponsorType
			url: sponsor.url,
			descripcionIdioma: sponsor.descripcionIdioma as "ES" | "EN",
			categoria: sponsor.categoria as SponsorCategory, // Ajuste de tipo
		},
	});

	const onSubmit = (data: SponsorFormValues) => {
		const updatedSponsor = { ...sponsor, ...data };
		onUpdate(updatedSponsor);
	};

	return (
		<div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
			<h2 className="text-lg font-bold mb-4">Actualizar Publicidad</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<Label>Imagen (URL)</Label>
					<Input {...register("image")} />
					{errors.image && (
						<p className="text-red-500 text-sm">{errors.image.message}</p>
					)}
				</div>
				<div>
					<Label>Enlace</Label>
					<Input {...register("url")} />
					{errors.url && (
						<p className="text-red-500 text-sm">{errors.url.message}</p>
					)}
				</div>
				<div>
					<Label>Idioma</Label>
					<Select
						onValueChange={(value: "ES" | "EN") =>
							setValue("descripcionIdioma", value)
						}
						defaultValue={sponsor.descripcionIdioma}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Seleccione un idioma" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ES">Español</SelectItem>
							<SelectItem value="EN">Inglés</SelectItem>
						</SelectContent>
					</Select>
					{errors.descripcionIdioma && (
						<p className="text-red-500 text-sm">
							{errors.descripcionIdioma.message}
						</p>
					)}
				</div>
				<div>
					<Label>Categoría</Label>
					<Select
						onValueChange={(value: SponsorCategory) =>
							setValue("categoria", value)
						}
						defaultValue={sponsor.categoria}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Seleccione una categoría" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="socio estratégico">
								Socio Estratégico
							</SelectItem>
							<SelectItem value="oro">Oro</SelectItem>
							<SelectItem value="plata">Plata</SelectItem>
							<SelectItem value="cobre">Cobre</SelectItem>
							<SelectItem value="colaborador">Colaborador</SelectItem>
							<SelectItem value="agradecimiento">Agradecimiento</SelectItem>
						</SelectContent>
					</Select>
					{errors.categoria && (
						<p className="text-red-500 text-sm">{errors.categoria.message}</p>
					)}
				</div>

				<Button type="submit" className="w-full">
					Actualizar
				</Button>
			</form>
		</div>
	);
}
