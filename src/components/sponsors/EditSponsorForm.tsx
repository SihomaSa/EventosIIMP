// EditSponsorForm.tsx
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { ImageInput } from "@/components/ImageInput";
import { createSponsor } from "../services/sponsorsService";
import { getSponsorCategories } from "../services/sponsorCategoriesService";
import { useEventStore } from "@/stores/eventStore";
import { fileToBase64 } from "@/utils/fileToBase64";

import { SponsorCategoryType } from "@/types/sponsorCategoryTypes";
import { LanguageType } from "@/types/languageTypes";

// 🧠 Zod Schema
const SponsorSchema = z.object({
	descripcion: z.string().min(1, "El nombre es obligatorio"),
	foto: z.instanceof(File, { message: "Debe seleccionar una imagen válida" }),
	url: z.string().url("Debe ser una URL válida"),
	categoria: z.string().min(1, "Selecciona una categoría válida"),
	idioma: z.enum(["1", "2"], {
		message: "Selecciona un idioma válido",
	}),
});

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
		control,
	} = useForm<SponsorFormValues>({
		resolver: zodResolver(SponsorSchema),
		defaultValues: {
			descripcion: "",
			foto: undefined,
			url: "",
			categoria: "",
			idioma: "2",
		},
	});

	const [preview, setPreview] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [sponsorCategories, setSponsorCategories] = useState<SponsorCategoryType[]>([]);
	const [loading, setLoading] = useState(true);

	const idiomaSeleccionado = watch("idioma");

	// 🚀 Cargar categorías
	useEffect(() => {
		(async () => {
			try {
				const data = await getSponsorCategories();
				setSponsorCategories(data || []);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const filteredCategories = sponsorCategories.filter(
		(cat) => cat.idIdioma === idiomaSeleccionado
	);

	// 📦 Envío del formulario
	const onSubmit = async (data: SponsorFormValues) => {
		const toastId = toast.loading("Procesando auspiciador...");
		try {
			if (!selectedEvent) throw new Error("No hay evento seleccionado");

			const base64Image = await fileToBase64(data.foto);

			const sponsorData = {
				descripcion: data.descripcion,
				idEvento: String(selectedEvent.idEvent),
				foto: base64Image,
				url: data.url,
				categoria: data.categoria,
				idioma: data.idioma,
			};

			await createSponsor(sponsorData);

			toast.success("Auspiciador creado exitosamente ✅", { id: toastId });
			onAdd();
			reset();
			onClose();
		} catch (error) {
			console.error("Error en el proceso:", {
				error,
				inputData: { ...data, foto: "[BASE64_REDUCIDO]" },
			});
			toast.error("Error al crear auspiciador", { id: toastId });
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
				<h2 className="text-xl">Editar Auspiciador</h2>

				{/* Nombre */}
				<div>
					<Label htmlFor="descripcion">Nombre</Label>
					<Input id="descripcion" {...register("descripcion")} />
					{errors.descripcion && (
						<p className="text-red-500 text-sm">{errors.descripcion.message}</p>
					)}
				</div>

				{/* URL */}
				<div>
					<Label htmlFor="url">Enlace</Label>
					<Input id="url" {...register("url")} />
					{errors.url && (
						<p className="text-red-500 text-sm">{errors.url.message}</p>
					)}
				</div>

				{/* Idioma */}
				<div>
					<Label>Idioma</Label>
					<RadioGroup
						value={idiomaSeleccionado}
						onValueChange={(value: LanguageType) => setValue("idioma", value)}
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

				{/* Categoría */}
				<div>
					<Label>Categoría</Label>
					<Controller
						name="categoria"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								disabled={loading}
								onValueChange={field.onChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Seleccione una categoría" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Categoría</SelectLabel>
										{filteredCategories.map((cat) => (
											<SelectItem
												key={cat.idCategoriaAus}
												value={String(cat.idCategoriaAus)}
											>
												{cat.descripcion}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						)}
					/>
					{loading && (
						<div className="flex items-center text-sm text-muted-foreground mt-1">
							<Loader2 className="animate-spin mr-2 h-4 w-4" />
							Cargando categorías...
						</div>
					)}
					{errors.categoria && (
						<p className="text-red-500 text-sm">{errors.categoria.message}</p>
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
				{errors.foto && (
					<p className="text-red-500 text-sm">{errors.foto.message}</p>
				)}

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
