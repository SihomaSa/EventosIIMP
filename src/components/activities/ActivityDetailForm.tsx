import React, { FormEvent, useState } from "react";
import { ActivityDetail } from "@/types/activityTypes"; // Asegúrate de importar el tipo correcto
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

interface ActivityDetailFormProps {
	details: ActivityDetail;
	handleChange: (field: keyof ActivityDetail, value: string) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ActivityDetailForm: React.FC<ActivityDetailFormProps> = ({
	details,
	handleChange,
	handleSubmit,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="border-primary"
			>
				<Card className="border-primary py-0 overflow-hidden">
					<CardHeader className="text-sm font-bold flex justify-between items-center w-full h-17 rounded-t-lg bg-primary text-white uppercase">
						<div className="text-sm font-bold flex justify-between items-center w-full h-9 ">
							<h1>{details.desTipoActividad}</h1>
						</div>
						<CollapsibleTrigger asChild>
							<Button variant="ghost" size="sm" className="w-9 p-0">
								<ChevronsUpDown className="h-4 w-4" />
								<span className="sr-only">Toggle</span>
							</Button>
						</CollapsibleTrigger>
					</CardHeader>
					<CollapsibleContent>
						<CardContent className="text-sm">
							<form onSubmit={handleSubmit} className="p-2 space-y-4">
								<div className="gap-y-3 flex flex-col">
									{details.desTipoActividad && (
										<>
											<input
												type="text"
												value={details.desTipoActividad}
												onChange={(e) =>
													handleChange("desTipoActividad", e.target.value)
												}
												hidden
											/>
											<div>
												<Label htmlFor="especialidad" className="mb-2">
													Responsables
												</Label>
												<Input
													id="especialidad"
													value={
														details.responsable
															? details.responsable
															: "Sin asignar"
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</>
									)}
									{details.lugar && (
										<>
											<input
												type="text"
												value={details.lugar}
												onChange={(e) => handleChange("lugar", e.target.value)}
												hidden
											/>
											<div>
												<Label htmlFor="lugar" className="mb-2">
													Lugar
												</Label>
												<Input
													id="lugar"
													value={details.lugar ? details.lugar : "Sin asignar"}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</>
									)}
									{details.horaIni && (
										<>
											<input
												type="text"
												value={details.horaIni}
												onChange={(e) =>
													handleChange("horaIni", e.target.value)
												}
												hidden
											/>
											<div>
												<Label htmlFor="horaIni" className="mb-2">
													Hora de Inicio
												</Label>
												<Input
													id="horaIni"
													value={
														details.horaIni
															? details.horaIni.split("T")[1]
															: "Sin asignar"
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</>
									)}
									{details.horaFin && (
										<>
											<input
												type="text"
												value={details.horaFin}
												onChange={(e) =>
													handleChange("horaFin", e.target.value)
												}
												hidden
											/>
											<div>
												<Label htmlFor="horaFin" className="mb-2">
													Hora de finalización
												</Label>
												<Input
													id="horaFin"
													value={
														details.horaFin
															? details.horaFin.split("T")[1]
															: "Sin asignar"
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</>
									)}
									{details.idioma && (
										<>
											<input
												type="text"
												value={details.idioma}
												onChange={(e) => handleChange("idioma", e.target.value)}
												hidden
											/>
											<div>
												<Label htmlFor="idioma" className="mb-2">
													Idioma
												</Label>
												<Input
													id="idioma"
													value={
														details.idioma ? details.idioma : "Sin asignar"
													}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</>
									)}
								</div>
							</form>
						</CardContent>
                        <CardFooter className="flex justify-between pb-2">
                            <Button variant="outline">Eliminar</Button>
                            <Button>Editar</Button>
                        </CardFooter>
					</CollapsibleContent>

				</Card>
				{/* <div className="text-sm font-bold flex justify-between items-center px-4 w-full h-17 rounded-t-lg bg-primary text-white uppercase">
					<div className="text-sm font-bold flex justify-between items-center w-full h-9 ">
						<h1>{details.desTipoActividad}</h1>
					</div>
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm" className="w-9 p-0">
							<ChevronsUpDown className="h-4 w-4" />
							<span className="sr-only">Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="bg-white pt-6 border-primary ">
					<form onSubmit={handleSubmit} className="space-y-4 text-black px-5 border-primary ">
						<div className="gap-y-3 flex flex-col">
							{details.desTipoActividad && (
								<>
									<input
										type="text"
										value={details.desTipoActividad}
										onChange={(e) =>
											handleChange("desTipoActividad", e.target.value)
										}
										hidden
									/>
									<div>
										<Label htmlFor="especialidad" className="mb-2">
											Responsables
										</Label>
										<Input
											id="especialidad"
											value={
												details.responsable
													? details.responsable
													: "Sin asignar"
											}
											disabled
											className="bg-gray-100"
										/>
									</div>
								</>
							)}
							{details.lugar && (
								<>
									<input
										type="text"
										value={details.lugar}
										onChange={(e) => handleChange("lugar", e.target.value)}
										hidden
									/>
									<div>
										<Label htmlFor="lugar" className="mb-2">
											Lugar
										</Label>
										<Input
											id="lugar"
											value={details.lugar ? details.lugar : "Sin asignar"}
											disabled
											className="bg-gray-100"
										/>
									</div>
								</>
							)}
							{details.horaIni && (
								<>
									<input
										type="text"
										value={details.horaIni}
										onChange={(e) => handleChange("horaIni", e.target.value)}
										hidden
									/>
									<div>
										<Label htmlFor="horaIni" className="mb-2">
											Hora de Inicio
										</Label>
										<Input
											id="horaIni"
											value={
												details.horaIni
													? details.horaIni.split("T")[1]
													: "Sin asignar"
											}
											disabled
											className="bg-gray-100"
										/>
									</div>
								</>
							)}
							{details.horaFin && (
								<>
									<input
										type="text"
										value={details.horaFin}
										onChange={(e) => handleChange("horaFin", e.target.value)}
										hidden
									/>
									<div>
										<Label htmlFor="horaFin" className="mb-2">
											Hora de finalización
										</Label>
										<Input
											id="horaFin"
											value={
												details.horaFin
													? details.horaFin.split("T")[1]
													: "Sin asignar"
											}
											disabled
											className="bg-gray-100"
										/>
									</div>
								</>
							)}
							{details.idioma && (
								<>
									<input
										type="text"
										value={details.idioma}
										onChange={(e) => handleChange("idioma", e.target.value)}
										hidden
									/>
									<div>
										<Label htmlFor="idioma" className="mb-2">
											Idioma
										</Label>
										<Input
											id="idioma"
											value={details.idioma ? details.idioma : "Sin asignar"}
											disabled
											className="bg-gray-100"
										/>
									</div>
								</>
							)}
						</div>
					</form>
				</CollapsibleContent> */}
			</Collapsible>
		</>
	);
};

export default ActivityDetailForm;
