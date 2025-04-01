import { FormEvent, useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getActivities } from "@/components/services/activitiesServicec";
import { ActivityDay, ActivityDetail } from "../types/activityTypes";
import ActivityDayCard from "@/components/activities/ActivityDayCard";

export default function Expositors() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// const [selectedExpositor, setSelectedExpositor] =
	// 	useState<ActivityDetail | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	// const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [expositorsUpdated, setExpositorsUpdated] = useState(0);
	const [activities, setActivities] = useState<ActivityDay[] | null>(null);

	useEffect(() => {
		const fetchExpositors = async () => {
			try {
				const data = await getActivities();
				setActivities(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al obtener los publicidades");
			} finally {
				setLoading(false);
			}
		};

		fetchExpositors();
	}, [expositorsUpdated]);

	const handleAddExpositor = () => {
		setExpositorsUpdated((prev) => prev + 1);
		setIsAddModalOpen(false);
	};

	// const handleUpdateExpositor = () => {
	// 	setExpositorsUpdated((prev) => prev + 1);
	// 	setSelectedExpositor(null);
	// 	setIsUpdateModalOpen(false);
	// };


	const handleChange = (field: keyof ActivityDetail, value: string) => {
		setActivities(
			(prev) =>
				prev &&
				prev.map((activity, index) =>
					index === 0 ? { ...activity, [field]: value } : activity
				)
		);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("Actividades guardadas:", activities);
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-3 md:p-6 flex flex-col items-center">
			<div className="flex items-center justify-between w-full px-20">
				<h1 className="text-2xl font-bold mb-7">Actividades del Evento</h1>
				<Button>
					{" "}
					<CalendarDays /> Agregar nueva fecha
				</Button>
			</div>

			<div className="flex flex-col-reverse md:flex-row w-full h-full bg-white py-8 rounded-xl">
				<div className="flex flex-wrap gap-4 justify-center w-2/3">
					{/* Skeleton */}
					{loading && (
						<div className="flex gap-4 space-y-3">
							{[...Array(3)].map((_, index) => (
								<div key={index} className="flex flex-col space-y-3">
									<Skeleton className="h-[125px] w-[200px] rounded-xl bg-primary/60" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-[200px] bg-primary/60" />
										<Skeleton className="h-4 w-[200px] bg-primary/60" />
										<Skeleton className="h-4 w-[200px] bg-primary/60" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-7 w-[200px] bg-primary/60" />
									</div>
								</div>
							))}
						</div>
					)}
					{/* <div>
						<Card className="bg-secondary text-primary text-4xl font-bold shadow-xl max-w-100">
							<CardHeader className="text-2xl font-bold leading-4">
								<span>08</span>
								<span>Mayo</span>
							</CardHeader>
							<CardContent className="flex flex-col gap-y-3">
								<Card>
									<CardContent className="text-sm">
										<form className="p-2 space-y-4">
											<div>
												<Label htmlFor="especialidad" className="mb-2">
													Fecha
												</Label>
												<Input
													id="especialidad"
													value={"08:00 a 9:00"}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="nombres" className="mb-2">
													descripcion
												</Label>
												<Input
													id="nombres"
													value={
														"Alteración desde la recolección de datos de campo a la generación de objetivos de machine learning."
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="apellidos" className="mb-2">
													Tipo de Actividad
												</Label>
												<Input
													id="apellidos"
													value={"Viaje de Campo"}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</form>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button variant="outline">Eliminar</Button>
										<Button>Editar</Button>
									</CardFooter>
								</Card>

								<Card className="border-primary pt-0">
									<CardHeader className="text-sm font-bold flex justify-between items-center w-full h-17 rounded-t-lg bg-primary text-white uppercase">
										<div className="text-lg font-bold flex justify-between items-center w-full h-9 ">
											<h1>CORTE DE CINTA EXHIBICIÓN</h1>
										</div>
									</CardHeader>
									<CardContent className="text-lg">
										<form className="p-2 space-y-2">
											<div>
												<Label htmlFor="nombres" className="mb-2">
													descripcion
												</Label>
												<Input
													id="nombres"
													value={
														"Alteración desde la recolección de datos de campo a la generación de objetivos de machine learning."
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="apellidos" className="mb-2">
													Tipo de Actividad
												</Label>
												<Input
													id="apellidos"
													value={"expositor.apellidos"}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="especialidad" className="mb-2">
													Fecha
												</Label>
												<Input
													id="especialidad"
													value={"08:00 a 9:00"}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</form>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button variant="outline">Eliminar</Button>
										<Button>Editar</Button>
									</CardFooter>
								</Card>


								<Card>

									<CardContent className="text-sm">
										<form className="p-2 space-y-4">
											<div>
												<Label htmlFor="especialidad" className="mb-2">
													Fecha
												</Label>
												<Input
													id="especialidad"
													value={"08:00 a 9:00"}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="nombres" className="mb-2">
													descripcion
												</Label>
												<Input
													id="nombres"
													value={
														"Alteración desde la recolección de datos de campo a la generación de objetivos de machine learning."
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="apellidos" className="mb-2">
													Tipo de Actividad
												</Label>
												<Input
													id="apellidos"
													value={"Viaje de Campo"}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</form>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button variant="outline">Eliminar</Button>
										<Button>Editar</Button>
									</CardFooter>
								</Card>

								<div className="flex flex-col gap-y-4 mb-4">
									<div
										className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl"
										onClick={() => setIsAddModalOpen(!isAddModalOpen)}
									>
										<h3 className="text-lg font-semibold">Agregar Actividad</h3>
										<Plus size={50} />
									</div>
									{isAddModalOpen && (
										<EditExpositorForm
											onClose={() => setIsAddModalOpen(false)}
											onAdd={handleAddExpositor}
										/>
									)}
								</div>
							</CardContent>
						</Card>
					</div> */}
					{/* Card 2 */}
					{activities &&
						activities.map((activity, index) => {
							return (
								<ActivityDayCard
									key={index}
									activity={activity}
									handleChange={handleChange}
									handleSubmit={handleSubmit}
								/>
							);
						})}
					{/* <div>
						<Card className="bg-secondary text-primary text-4xl font-bold shadow-xl max-w-100">
							<CardHeader className="text-2xl font-bold leading-4">
								<span>09</span>
								<span>Mayo</span>
							</CardHeader>
							<CardContent className="flex flex-col gap-y-3">
								<Card>
									<CardContent className="text-sm">
										<form className="p-2 space-y-4">
											<div>
												<Label htmlFor="especialidad" className="mb-2">
													Fecha
												</Label>
												<Input
													id="especialidad"
													value={"08:00 a 9:00"}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="nombres" className="mb-2">
													descripcion
												</Label>
												<Input
													id="nombres"
													value={
														"Alteración desde la recolección de datos de campo a la generación de objetivos de machine learning."
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="apellidos" className="mb-2">
													Tipo de Actividad
												</Label>
												<Input
													id="apellidos"
													value={"Viaje de Campo"}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</form>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button variant="outline">Eliminar</Button>
										<Button>Editar</Button>
									</CardFooter>
								</Card>
								<Card>
									<CardContent className="text-sm">
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button variant="outline">Eliminar</Button>
										<Button>Editar</Button>
									</CardFooter>
								</Card>

								<div className="flex flex-col gap-y-4 mb-4">
									<Dialog>
										<DialogTrigger asChild>
											<div className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl">
												<h3 className="text-lg font-semibold">
													Agregar Actividad
												</h3>
												<Plus size={50} />
											</div>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>Agregar Actividad</DialogTitle>
												<DialogDescription>
													Realiza tus cambios aquí
												</DialogDescription>
											</DialogHeader>
											<form className="p-2 space-y-4" onSubmit={handleSubmit}>
												<div>
													<Label htmlFor="especialidad" className="mb-2">
														Fecha
													</Label>
													<Input
														id="especialidad"
														value={"08:00 a 9:00"}
														disabled
														className="bg-gray-100"
													/>
												</div>
												<div>
													<Label htmlFor="nombres" className="mb-2">
														descripcion
													</Label>
													<Input
														id="nombres"
														value={
															"Alteración desde la recolección de datos de campo a la generación de objetivos de machine learning."
														}
														disabled
														className="bg-gray-100"
													/>
												</div>
												<div>
													<Label htmlFor="apellidos" className="mb-2">
														Tipo de Actividad
													</Label>
													<Input
														id="apellidos"
														value={"Viaje de Campo"}
														disabled
														className="bg-gray-100"
													/>
												</div>
												<DialogFooter>
													<Button type="submit">Save changes</Button>
												</DialogFooter>
											</form>
										</DialogContent>
									</Dialog>
								</div>
							</CardContent>
						</Card>
					</div> */}
				</div>
			</div>
			{/* {isUpdateModalOpen && selectedExpositor && (
				<UpdateExpositorModal
					expositor={selectedExpositor}
					onUpdate={handleUpdateExpositor}
					open={isUpdateModalOpen}
					onClose={() => setIsUpdateModalOpen(false)}
				/>
			)} */}
		</div>
	);
}
