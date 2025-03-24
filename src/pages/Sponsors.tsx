import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import UpdateSponsorModal from "@/components/sponsors/UpdateSponsorModal";
import EditSponsorForm from "@/components/sponsors/EditSponsorForm";
import SponsorCard from "@/components/sponsors/SponsorCard";
import { SponsorType } from "@/types/sponsorTypes";

export default function Sponsors() {
	const [sponsors, setSponsors] = useState<SponsorType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedSponsor, setSelectedSponsor] = useState<SponsorType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

	useEffect(() => {
		const loadSponsors = async () => {
			try {
				const response = await fetch("https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/sponsor/event/1"); // Reemplaza con tu URL real
				if (!response.ok) throw new Error("Error al obtener los patrocinadores");

				const data: SponsorType[] = await response.json();
				setSponsors(data);
			} catch (err) {
				setError("Error al cargar los patrocinadores");
			} finally {
				setLoading(false);
			}
		};

		loadSponsors();
	}, []);

	const handleAddSponsor = (newSponsor: SponsorType) => {
		setSponsors((prev) => [...prev, newSponsor]);
		setIsAddModalOpen(false);
	};

	const handleUpdateSponsor = (updatedSponsor: SponsorType) => {
		setSponsors((prev) =>
			prev.map((sponsor) =>
				sponsor.idSponsor === updatedSponsor.idSponsor ? updatedSponsor : sponsor
			)
		);
		setSelectedSponsor(null);
		setIsUpdateModalOpen(false);
	};

	const openUpdateModal = (sponsor: SponsorType) => {
		setSelectedSponsor(sponsor);
		setIsUpdateModalOpen(true);
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-7">Gestión de Patrocinadores</h1>

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
					{sponsors.map((sponsor) => (
						<SponsorCard
							key={sponsor.idSponsor}
							sponsor={sponsor}
							openUpdateModal={() => openUpdateModal(sponsor)}
						/>
					))}
				</div>

				<div className="w-1/3 flex flex-col gap-y-4 mx-4">
					<div
						className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl"
						onClick={() => setShowForm(!showForm)}
					>
						<h3 className="text-lg font-semibold">Agregar Patrocinador</h3>
						<Plus size={50} />
					</div>
					{showForm && (
						<EditSponsorForm
							open={isAddModalOpen}
							onClose={() => setIsAddModalOpen(false)}
							onAdd={handleAddSponsor}
						/>
					)}
				</div>
			</div>
			{isUpdateModalOpen && selectedSponsor && (
				<UpdateSponsorModal
					sponsor={selectedSponsor}
					onUpdate={handleUpdateSponsor}
					open={isUpdateModalOpen}
					onClose={() => setIsUpdateModalOpen(false)}
				/>
			)}
		</div>
	);
}