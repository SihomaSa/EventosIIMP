import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdType, UpdateAdRequestType } from "@/types/adTypes";
import { LanguageType } from "@/types/languageTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	DialogFooter,
} from "../ui/dialog";
import { useState, useEffect } from "react";
import { updateAd } from "../services/adsService";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useEventStore } from "@/stores/eventStore";

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
}

export default function EditActivityModal({
	onAdd,
	onClose,
}: UpdateAdsModalProps) {
	const { selectedEvent } = useEventStore();

	const [step, setStep] = useState(1);
	const [activityType, setActivityType] = useState("");

	const activityOptions = ["Pausa Café", "Conferencia", "Taller", "Otro"];

	const handleNext = () => {
		if (activityType) {
			setStep(2);
		} else {
			alert("Selecciona un tipo de actividad antes de continuar.");
		}
	};

	const handleBack = () => setStep(1);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<AdFormValues>({
		resolver: zodResolver(adSchema),
		defaultValues: {
			foto: undefined,
			url: "",
			idioma: "2",
		},
	});

	const onSubmit = async (data: AdFormValues) => {
		// console.log("Datos enviados:", data); cambiar por toast
		if (selectedEvent) {
			// try {
			// 	const newAd: NewAdRequestType = {
			// 		evento: String(selectedEvent.idEvent),
			// 		url: data.url,
			// 		idioma: data.idioma,
			// 	};
			// 	await createAd(newAd);
			// 	toast("La actividad ha sido creada satisfactoriamente ✅");
			// 	onAdd();
			// 	reset(); // Resetea el formulario
			// 	// onClose();
			// 	setPreview(null);
			// } catch (error) {
			// 	console.error("Error al convertir imagen", error);
			// }
		}
	};

	return (
		<div className="flex flex-col gap-y-4 mb-4">
			<Dialog>
				<DialogTrigger asChild>
					<div className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl">
						<h3 className="text-lg font-semibold">Agregar Actividad</h3>
						<Plus size={50} />
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{step === 1
								? "Selecciona el Tipo de Actividad"
								: "Agregar Actividad"}
						</DialogTitle>
						<DialogDescription>
							{step === 1
								? "Elige un tipo de actividad antes de continuar."
								: "Llena los campos para crear una nueva actividad."}
						</DialogDescription>
					</DialogHeader>
					{step === 1 ? (
						// Paso 1: Selección del tipo de actividad
						<div className="space-y-4">
							{activityOptions.map((option) => (
								<Button
									key={option}
									variant={activityType === option ? "default" : "outline"}
									className="w-full"
									onClick={() => setActivityType(option)}
								>
									{option}
								</Button>
							))}
							<DialogFooter>
								<Button onClick={handleNext} disabled={!activityType}>
									Siguiente
								</Button>
							</DialogFooter>
						</div>
					) : (
						// Paso 2: Formulario de detalles
						<form className="p-2 space-y-4" onSubmit={handleSubmit(onSubmit)}>
							<div>
								<Label>Tipo de Actividad</Label>
								<Input value={activityType} disabled className="bg-gray-100" />
							</div>
							<div>
								<Label>Fecha</Label>
								<Input
									value={"08:00 a 9:00"}
									className="bg-gray-100"
								/>
							</div>
							<div>
								<Label>Descripción</Label>
								<Input
									value={
										"Alteración desde la recolección de datos de campo a la generación de objetivos de machine learning."
									}
									className="bg-gray-100"
								/>
							</div>
							<div>
								<Label className="mb-2 font-bold">Idioma</Label>
								<RadioGroup id="idioma" {...register("idioma")}>
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
							<DialogFooter>
								<Button variant="outline" onClick={handleBack}>
									Volver
								</Button>
								<Button type="submit">Guardar</Button>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
