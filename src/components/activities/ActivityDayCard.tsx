import React, { FormEvent } from "react";
import { ActivityDay, ActivityDetail } from "@/types/activityTypes"; // Asegúrate de importar el tipo correcto
import { Card, CardContent, CardHeader } from "../ui/card";
import ActivityDetailForm from "./ActivityDetailForm";
import EditActivityModal from "./EditActivityModal";

interface ActivityDetailFormProps {
	activity: ActivityDay;
	handleChange: (field: keyof ActivityDetail, value: string) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ActivityDayCard: React.FC<ActivityDetailFormProps> = ({
	activity,
	handleChange,
	handleSubmit,
}) => {
	const getMonth = (date: string) => {
		const meses = [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		];

		return meses[+date.split("-")[1] - 1];
	};
	return (
		<div>
			<Card className="bg-secondary text-primary text-4xl font-bold shadow-xl max-w-100">
				<CardHeader className="text-xl font-bold leading-4">
					<span className="text-3xl">
						{activity.fechaActividad.split("-")[2]}
					</span>
					<span>{getMonth(activity.fechaActividad)}</span>
				</CardHeader>
				<CardContent className="flex flex-col gap-y-3">
					{activity?.detalles &&
						Array.isArray(activity.detalles) &&
						activity.detalles.map((det, index) => (
							<ActivityDetailForm
								key={index}
								details={det}
								handleChange={handleChange}
								handleSubmit={handleSubmit}
							/>
						))}

						<EditActivityModal onAdd={() => console.log("Creando")} onClose={() => console.log("Cerrando")}/>
				</CardContent>
			</Card>
		</div>
	);
};

export default ActivityDayCard;
