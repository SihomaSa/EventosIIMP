import React, { FormEvent } from "react";
import { ActivityDetail } from "@/types/activityTypes"; // Asegúrate de importar el tipo correcto
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

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
	return (
		<Card className="border-primary pt-0">
			<CardHeader className="text-sm font-bold flex justify-between items-center w-full h-17 rounded-t-lg bg-primary text-white uppercase">
				<div className="text-sm font-bold flex justify-between items-center w-full h-9 ">
					<h1>{details.desTipoActividad}</h1>
				</div>
			</CardHeader>
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
											details.responsable ? details.responsable : "Sin asignar"
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
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Eliminar</Button>
				<Button>Editar</Button>
			</CardFooter>
		</Card>
	);
};

export default ActivityDetailForm;
