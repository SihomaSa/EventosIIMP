import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useEffect, useState } from "react";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useEventStore } from "@/stores/eventStore";
import {
	ActivityType,
	NewClosingRequest,
	NewCoffeeBreakRequest,
	NewCongressInaugurationRequest,
	NewCourseRequest,
	NewExhibitionRibbonCuttingRequest,
	NewFieldTripRequest,
	NewGratitudDinnerRequest,
	NewLunchRequest,
	NewMagisterialConferenceRequest,
	NewOthersRequest,
	NewRoundTableRequest,
} from "../../types/activityTypes";
import { Calendar } from "../ui/calendar";
import {
	createActivityDetail,
	getActivityTypes,
} from "../services/activitiesServicec";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { activitySchemas, getActivitySchema } from "@/schemas/activitySchemas";
import { z } from "zod";

interface UpdateAdsModalProps {
	onAdd: () => void;
	onClose: () => void;
}

export default function EditActivityModal({
	onAdd,
	onClose,
}: UpdateAdsModalProps) {
	type ActivityTypeId = keyof typeof activitySchemas;
	const [activityTypes, setActivityTypes] = useState<ActivityType[] | []>([]);
	const { selectedEvent } = useEventStore();

	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [loadingTypes, setLoadingTypes] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activityType, setActivityType] = useState<
		keyof typeof activitySchemas | ""
	>("");
	const fieldsByActivityType: Record<number, string[]> = {
		1: [
			"idIdioma",
			"titulo",
			"responsable",
			"fechaIni",
			"fechaFin",
			"horaIni",
			"horaFin",
		], // Viaje de Campo
		2: [
			"idIdioma",
			"titulo",
			"responsable",
			"traduccion",
			"horaIni",
			"horaFin",
			"lugar",
		], // Curso Corto
		3: ["idIdioma", "titulo", "horaIni", "horaFin"], // Pausa Café
		4: ["idIdioma", "titulo", "horaIni", "horaFin"], // Almuerzo
		5: ["idIdioma", "titulo", "horaIni", "horaFin", "lugar"], // Corte de Cinta de Exhibición
		6: ["idIdioma", "titulo", "horaIni", "horaFin", "lugar"], // Clausura
		7: ["idIdioma", "titulo", "horaIni", "horaFin", "responsable"], // Otros
		8: ["idIdioma", "titulo", "horaIni", "horaFin", "lugar"], // Inauguración del Congreso
		9: ["idIdioma", "titulo", "horaIni", "horaFin"], // Cena de Agradecimiento
		10: ["idIdioma", "titulo", "horaIni", "horaFin"], // Conferencia Magistral
		11: ["idIdioma", "titulo", "horaIni", "horaFin"], // Mesa Redonda
	};
	type AcceptedFields =
		| "idIdioma"
		| "titulo"
		| "responsable"
		| "fechaFin"
		| "fechaIni"
		| "horaFin"
		| "horaIni"
		| "lugar"
		| "traduccion"
		| "duracion"
		| "foto"
		| "url"
		| "idioma"
		| "estado";
	const schema = activityType ? getActivitySchema(activityType) : z.object({});
	type FormData = z.infer<typeof schema>;
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});
	const handleSelectActivity = (value: number) => {
		setActivityType(value as ActivityTypeId);
		reset(); // Limpia campos anteriores al cambiar tipo
	};

	useEffect(() => {
		(async () => {
			try {
				const data = await getActivityTypes();
				setActivityTypes(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al obtener las categorías de auspiciadores");
				console.error(error);
			} finally {
				setLoadingTypes(false);
			}
		})();
	}, []);

	const handleNext = () => {
		if (activityType) {
			setStep(2);
		} else {
			toast("Selecciona un tipo de actividad antes de continuar.");
		}
	};

	const handleBack = () => {
		setStep(1);
		reset();
		setActivityType("");
	};
	const handleLanguageChange = (value: string) => {
		setValue("idIdioma" as keyof FormData, value as keyof FormData);
	};
	function isFieldTripRequest(data: any): data is NewFieldTripRequest {
		return (
			typeof data.responsable === "string" &&
			typeof data.fechaIni === "string" &&
			typeof data.fechaFin === "string"
		);
	}
	function isCourseRequest(data: any): data is NewCourseRequest {
		return (
			typeof data.responsable === "string" &&
			typeof data.traduccion === "string" &&
			typeof data.lugar === "string"
		);
	}

	function isExhibitionRibbonCuttingRequest(
		data: any
	): data is NewExhibitionRibbonCuttingRequest {
		return typeof data.lugar === "string";
	}
	function isCoffeeBreakRequest(data: any): data is NewCoffeeBreakRequest {
		return typeof data.titulo === "string";
	}
	function isLunchRequest(data: any): data is NewLunchRequest {
		return typeof data.titulo === "string";
	}
	
	function isClosingRequest(data: any): data is NewClosingRequest {
		return typeof data.lugar === "string";
	}
	
	function isOthersRequest(data: any): data is NewOthersRequest {
		return typeof data.responsable === "string";
	}
	
	function isCongressInaugurationRequest(data: any): data is NewCongressInaugurationRequest {
		return (
			typeof data.lugar === "string"
		);
	}
	
	function isGratitudDinnerRequest(data: any): data is NewGratitudDinnerRequest {
		return typeof data.titulo === "string";
	}
	function isMagisterialConferenceRequest(data: any): data is NewMagisterialConferenceRequest {
		return typeof data.titulo === "string";
	}
	function isRoundTableRequest(data: any): data is NewRoundTableRequest {
		return typeof data.titulo === "string";
	}

	const onSubmit = async (data: FormData) => {
		if (!selectedEvent || !activityType) return;
		
		try {
			setLoading(true);
	
			let detalles;
	
			if (activityType === 1 && isFieldTripRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
					responsable: data.responsable ?? "",
					fechaIni: data.fechaIni ?? "",
					fechaFin: data.fechaFin ?? "",
				};
			} else if (activityType === 2 && isCourseRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
					responsable: data.responsable ?? "",
					traduccion: data.traduccion ?? "",
					lugar: data.lugar ?? "",
				};
			} else if (activityType === 3 && isCoffeeBreakRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
				};
			} else if (activityType === 4 && isLunchRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
				};
			} else if (activityType === 5 && isExhibitionRibbonCuttingRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
					lugar: data.lugar ?? "",
				};
			} else if (activityType === 6 && isClosingRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
					lugar: data.lugar ?? "",
				};
			} else if (activityType === 7 && isOthersRequest(data)) {
				detalles = {
					titulo: data.titulo,
					responsable: data.responsable ?? "",
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
				};
			} else if (activityType === 8 && isCongressInaugurationRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
					lugar: data.lugar ?? "",
				};
			} else if (activityType === 9 && isGratitudDinnerRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
				};
			}else if (activityType === 10 && isMagisterialConferenceRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
				};
			}else if (activityType === 11 && isRoundTableRequest(data)) {
				detalles = {
					titulo: data.titulo,
					horaIni: data.horaIni,
					horaFin: data.horaFin,
					idIdioma: data.idIdioma as LanguageType,
				};
			};
			if (detalles) {
				const newActivityDet = [
					{
						fechaActividad: "2025-04-07",
						idEvento: selectedEvent.idEvent,
						idTipoActividad: activityType,
						detalles: [detalles],
					},
				] satisfies Parameters<typeof createActivityDetail>[0];
	
				await createActivityDetail(newActivityDet);
	
				toast("La actividad ha sido creada satisfactoriamente ✅");
				setActivityType("");
				setStep(1);
				onAdd();
				reset();
				onClose();
			}
		} catch (error) {
			console.error("Error al solicitar creación de actividad", error);
		} finally {
			setLoading(false);
		}
	};
	// console.log(errors);

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
						<div className="space-y-4">
							{activityTypes.map((option) => (
								<Button
									key={option.idTipoActividad}
									variant={
										activityType === option.idTipoActividad
											? "default"
											: "outline"
									}
									className="w-full"
									onClick={() => {
										setActivityType(
											option.idTipoActividad as typeof activityType
										);
										handleSelectActivity(option.idTipoActividad);
									}}
								>
									{option.des_actividad}
								</Button>
							))}
							{loadingTypes && (
								<div className="flex">
									<Loader2 className="animate-spin inline-block mr-2" />
									Cargando tipos de actividad...
								</div>
							)}
							<DialogFooter>
								<Button onClick={handleNext} disabled={!activityType}>
									Siguiente
								</Button>
							</DialogFooter>
						</div>
					) : (
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-4 px-2 overflow-y-scroll max-h-[70vh]"
						>
							{activityType &&
								fieldsByActivityType[activityType]?.map((field, index) => (
									<div key={index}>
										{field === "idIdioma" ? (
											<>
												<Label htmlFor={field} className="mb-2 capitalize">
													Idioma
												</Label>
												<RadioGroup
													id={field}
													onValueChange={handleLanguageChange}
													value={String(watch("idIdioma" as keyof FormData))}
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
											</>
										) : field === "horaIni" || field === "horaFin" ? (
											<>
												<Label htmlFor={field} className="mb-2 capitalize">
													{field === "horaIni"
														? "Hora de Inicio"
														: "Hora de Finalización"}
												</Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															id={field}
															variant={"outline"}
															className={cn(
																" pl-3 text-left font-normal overflow-hidden",
																!field && "text-muted-foreground"
															)}
														>
															{getValues(field as keyof FormData) ? (
																<span className="">
																	{/* {String(date.toISOString().split("T")[0])} */}
																	{getValues(field as keyof FormData)}
																</span>
															) : (
																<span>seleccione una fecha</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={
																watch(field as keyof FormData) ? new Date(String(watch(field as keyof FormData))) : undefined
															}
															onSelect={(date) => {
																if (date) {
																	const isoDate = date.toISOString().split("T")[0];
																	setValue(field as keyof FormData, isoDate as never ); // ya no hay error aquí
																}
															}}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</>
										) : field === "fechaIni" || field === "fechaFin" ? (
											<>
												<Label htmlFor={field} className="mb-2 capitalize">
													{field === "fechaIni"
														? "Fecha de Inicio"
														: "Fecha de Finalización"}
												</Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															id={field}
															variant={"outline"}
															className={cn(
																" pl-3 text-left font-normal overflow-hidden",
																!field && "text-muted-foreground"
															)}
														>
															{getValues(field as keyof FormData) ? (
																<span className="">
																	{getValues(field as keyof FormData)}
																</span>
															) : (
																<span>seleccione una fecha</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={
																watch(field as keyof FormData) ? new Date(String(watch(field as keyof FormData))) : undefined
															}
															onSelect={(date) => {
																if (date) {
																	const isoDate = date.toISOString().split("T")[0];
																	setValue(field as keyof FormData, isoDate as never ); // ya no hay error aquí
																}
															}}
															// disabled={(date) =>
															// 	date > new Date() ||
															// 	date < new Date("1900-01-01")
															// }
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</>
										) : (
											<>
												<Label htmlFor={field} className="mb-2 capitalize">
													{field}
												</Label>
												<Input
													id={field}
													type="text"
													{...register(field as AcceptedFields)}
													className=""
												/>
											</>
										)}

										{errors[field as keyof typeof errors] && (
											<p className="text-red-500 text-sm">
												{errors[
													field as keyof typeof errors
												]?.message?.toString()}
											</p>
										)}
									</div>
								))}
							<div className="flex justify-end gap-x-2">
								<Button variant="outline" onClick={handleBack}>
									Volver
								</Button>
								<Button type="submit" disabled={loading}>
									Guardar
								</Button>
							</div>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
