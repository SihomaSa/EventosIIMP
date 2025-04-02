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

	// const handleAddExpositor = () => {
	// 	setExpositorsUpdated((prev) => prev + 1);
	// 	setIsAddModalOpen(false);
	// };

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
		<div className="p-6 flex flex-col items-center">
			<div className="flex items-center justify-between w-full px-20">
				<h1 className="text-2xl font-bold mb-7">Actividades del Evento</h1>
				<Button>
					{" "}
					<CalendarDays /> Agregar nueva fecha
				</Button>
			</div>

			<div className="flex flex-col-reverse md:flex-row w-full h-full bg-white py-8 px-3 rounded-xl">
				<div className="flex flex-wrap gap-4 justify-center">
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
