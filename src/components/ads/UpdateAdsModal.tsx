import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdType } from "@/types/adTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";

const adSchema = z.object({
	foto: z.instanceof(File).optional(),
	url: z.string().url({ message: "Debe ser una URL válida" }),
	prefijoIdioma: z.enum(["SP", "EN"], {
		message: "Seleccione un idioma válido",
	}),
	estado: z
		.number()
		.int()
		.min(0)
		.max(1, { message: "El estado debe ser 0 (inactivo) o 1 (activo)" }),
});

type AdFormValues = z.infer<typeof adSchema>;

interface UpdateAdsModalProps {
	onAdd: (newAd: AdType) => void;
	onClose: () => void;
	ad: AdType;
	onUpdate: (updated: AdType) => void;
	open: boolean;
}

export default function UpdateAdsModal({
	onClose,
	ad,
	onUpdate,
	open,
}: UpdateAdsModalProps) {
	const [imagePreview, setImagePreview] = useState<string | null>(ad.foto || null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<AdFormValues>({
		resolver: zodResolver(adSchema),
		defaultValues: {
			foto: undefined,
			url: ad.url,
			prefijoIdioma: ad.prefijoIdioma as "SP" | "EN",
			estado: ad.estado,
		},
	});

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const onSubmit = (data: AdFormValues) => {
		const updatedAd = { ...ad, ...data };
		onUpdate(updatedAd);
		reset();
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Publicidad</DialogTitle>
				</DialogHeader>
				<Card>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
						<h2 className="text-xl">Editar Publicación</h2>
						<div>
							<Label htmlFor="foto" className="mb-2">Imagen</Label>
							<Input id="foto" type="file" accept="image/*" onChange={onFileChange} />
							{imagePreview && (
								<img
									src={imagePreview}
									alt="Vista previa"
									className="mt-2 max-w-xs rounded"
								/>
							)}
						</div>

						<div>
							<Label htmlFor="url" className="mb-2">Enlace</Label>
							<Input id="url" {...register("url")} />
							{errors.url && (
								<p className="text-red-500 text-sm">{errors.url.message}</p>
							)}
						</div>

						<div>
							<Label className="mb-2">Idioma</Label>
							<RadioGroup defaultValue={ad.prefijoIdioma} {...register("prefijoIdioma")}>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="SP" id="SP" />
									<Label htmlFor="SP">Español</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="EN" id="EN" />
									<Label htmlFor="EN">Inglés</Label>
								</div>
							</RadioGroup>
							{errors.prefijoIdioma && (
								<p className="text-red-500 text-sm">{errors.prefijoIdioma.message}</p>
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
			</DialogContent>
		</Dialog>
	);
}
