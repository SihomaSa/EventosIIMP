import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import UpdateExpositorModal from "@/components/expositors/UpdateExpositorModal";
import EditExpositorForm from "@/components/expositors/EditExpositorForm";
import ExpositorCard from "@/components/expositors/ExpositorCard";
import { ExpositorType } from "@/types/expositorTypes";

export default function Expositors() {
	const [expositors, setExpositors] = useState<ExpositorType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedExpositor, setSelectedExpositor] =
		useState<ExpositorType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

	useEffect(() => {
		const loadExpositors = async () => {
			try {
				const response = await fetch("https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/author/1"); 
				if (!response.ok) throw new Error("Error al obtener expositores");

				const data: ExpositorType[] = await response.json();
				setExpositors(data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los expositores");
			} finally {
				setLoading(false);
			}
		};

		loadExpositors();
	}, []);

	const handleAddExpositor = (newExpositor: ExpositorType) => {
		setExpositors((prev) => [...prev, newExpositor]);
		setIsAddModalOpen(false);
	};

	const handleUpdateExpositor = (updatedExpositor: ExpositorType) => {
		setExpositors((prev) =>
			prev.map((expositor) =>
				expositor.idautor === updatedExpositor.idautor
					? updatedExpositor
					: expositor
			)
		);
		setSelectedExpositor(null);
		setIsUpdateModalOpen(false);
	};

	const openUpdateModal = (expositor: ExpositorType) => {
		setSelectedExpositor(expositor);
		setIsUpdateModalOpen(true);
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-7">Gestión de Expositores</h1>

			<div className="flex w-full h-full ">
				<div className="flex flex-wrap gap-4 justify-center w-2/3">
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
					{expositors.map((expositor) => (
						<ExpositorCard
							key={expositor.idautor}
							expositor={expositor}
							openUpdateModal={() => openUpdateModal(expositor)}
						/>
					))}
				</div>

				<div className="w-1/3 flex flex-col gap-y-4 mx-4">
					<div
						className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl"
						onClick={() => setShowForm(!showForm)}
					>
						<h3 className="text-lg font-semibold">Agregar Expositor</h3>
						<Plus size={50} />
					</div>
					{showForm && (
						<EditExpositorForm
							open={isAddModalOpen}
							onClose={() => setIsAddModalOpen(false)}
							onAdd={handleAddExpositor}
						/>
					)}
				</div>
			</div>
			{isUpdateModalOpen && selectedExpositor && (
				<UpdateExpositorModal
					expositor={selectedExpositor}
					onUpdate={handleUpdateExpositor}
					open={isUpdateModalOpen}
					onClose={() => setIsUpdateModalOpen(false)}
				/>
			)}
		</div>
	);
}
