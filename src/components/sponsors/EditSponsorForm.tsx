import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { NewSponsorRequestType } from "@/types/sponsorTypes";
import { createSponsor } from "../services/sponsorsService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";
import { Loader2 } from "lucide-react";
import { LanguageType } from "@/types/languageTypes";
import { useEffect, useState } from "react";
import { getSponsorCategories } from "../services/sponsorCategoriesService";
import { SponsorCategoryType } from "@/types/sponsorCategoryTypes";
import { ImageInput } from "../ImageInput";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

// ✅ Esquema de validación con Zod
const SponsorSchema = z.object({
	descripcion: z.string().min(1, "El nombre es obligatorio"),
	foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
	url: z.string().url("Debe ser una URL válida"),
	categoria: z.string().min(1, "Selecciona una categoría válida"),
	idioma: z.enum(["1", "2"], {
		message: "Selecciona un idioma válido",
	}),
});

// ✅ Tipo basado en Zod
type SponsorFormValues = z.infer<typeof SponsorSchema>;

export default function EditSponsorForm({
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
	} = useForm<SponsorFormValues>({
		resolver: zodResolver(SponsorSchema),
		defaultValues: {
			descripcion: "",
			foto: undefined,
			url: "",
			categoria: "colaborador",
			idioma: "2",
		},
	});

	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [sponsorCategories, setSponsorCategories] = useState<
		SponsorCategoryType[] | null
	>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [language, setlanguage] = useState("2");
	const [filteredCategories, setFilteredCategories] = useState<
		SponsorCategoryType[] | null
	>(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await getSponsorCategories();
				setSponsorCategories(data || []);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al obtener las categorías de auspiciadores");
			} finally {
				setLoading(false);
			}
		})();
	}, []);
	
	useEffect(() => {
		setFilteredCategories(
			sponsorCategories?.filter((cat) => cat.idIdioma === language) || []
		);
	}, [language, sponsorCategories]);

	const handleLanguageChange = (value: LanguageType) => {
		setValue("idioma", value, { shouldValidate: true });
		setlanguage(value);
	};

	const onSubmit = async (data: SponsorFormValues) => {
		if (selectedEvent) {
			try {
				const base64Image = await fileToBase64(data.foto);
				const newSponsor: NewSponsorRequestType = {
					descripcion: data.descripcion,
					foto: base64Image,
					url: data.url,
					idEvento: String(selectedEvent.idEvent),
					categoria: String(data.categoria),
					idioma: data.idioma,
				};

				await createSponsor(newSponsor);
				alert("Sponsor creado exitosamente"); // TODO cambiar por un toast
				onAdd();
				reset(); // Resetea el formulario
				onClose(); // Cierra el modal
				setPreview(null);
			} catch (error) {
				console.error("Error al convertir imagen", error);
			}
		}
	};

	// ERROR al cargar categorias
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
				<h2 className="text-xl">Editar Auspiciador</h2>

				<div>
					<Label htmlFor="nombre" className="mb-2">
						Nombre
					</Label>
					<Input id="nombre" {...register("descripcion")} />
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

				{/* Selector de categoría */}
				<div>
					<Label htmlFor="categoria" className="mb-2">
						Categoría
					</Label>
					<Select {...register("categoria")} disabled={loading}>
						<SelectTrigger className="w-55">
							<SelectValue placeholder="Seleccione una categoría" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Categoría</SelectLabel>
								{filteredCategories?.map(({ idCategoriaAus, descripcion }) => (
									<SelectItem
										key={idCategoriaAus}
										value={String(idCategoriaAus)}
									>
										{descripcion}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					{loading && (
						<div className="flex">
							<Loader2 className="animate-spin inline-block mr-2" />
							Cargando caterogías...
						</div>
					)}
					{errors.categoria && (
						<p className="text-red-500 text-sm">{errors.categoria.message}</p>
					)}
				</div>
				<ImageInput
					onChange={(file) => setValue("foto", file, { shouldValidate: true })}
					preview={preview}
					fileName={fileName}
					setPreview={setPreview}
					setFileName={setFileName}
				/>

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
