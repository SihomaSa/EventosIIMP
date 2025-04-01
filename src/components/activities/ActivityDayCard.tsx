import React, { FormEvent } from "react";
import { ActivityDay, ActivityDetail } from "@/types/activityTypes"; // Asegúrate de importar el tipo correcto
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Plus } from "lucide-react";
import ActivityDetailForm from "./ActivityDetailForm";

interface ActivityDetailFormProps {
	activity: ActivityDay | null;
	handleChange: (field: keyof ActivityDetail, value: string) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ActivityDayCard: React.FC<ActivityDetailFormProps> = ({
	activity,
	handleChange,
	handleSubmit,
}) => {
	return (
		<div>
			<Card className="bg-secondary text-primary text-4xl font-bold shadow-xl max-w-100">
				<CardHeader className="text-xl font-bold leading-4">
					<span>{activity?.fechaActividad.split("-")[2]}</span>
					<span>Mayo</span>
				</CardHeader>
				<CardContent className="flex flex-col gap-y-3">
					{/* <Card>
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
					</Card> */}

					{activity?.detalles && Array.isArray(activity.detalles) &&
					activity.detalles.map((det, index) => (
						<ActivityDetailForm
						key={index}
						details={det}
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						/>
					))
					}


					<div className="flex flex-col gap-y-4 mb-4">
						<Dialog>
							<DialogTrigger asChild>
								<div className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl">
									<h3 className="text-lg font-semibold">Agregar Actividad</h3>
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
		</div>
	);
};

export default ActivityDayCard;
