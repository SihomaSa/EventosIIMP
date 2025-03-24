import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import UpdateBulletinModal from "@/components/bulletins/UpdateBulletinModal";
import EditBulletinForm from "@/components/bulletins/EditBulletinForm";
import BulletinCard from "@/components/bulletins/BulletinCard";
import { BulletinType } from "@/types/bulletinTypes";

export default function Bulletins() {
	const [bulletins, setBulletins] = useState<BulletinType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedBulletin, setSelectedBulletin] = useState<BulletinType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

	useEffect(() => {
		const loadBulletins = async () => {
			try {
				const response = await fetch(
					"https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/news/event/1"
				); // Reemplaza con tu URL real
				if (!response.ok) throw new Error("Error al obtener eventos");

				const data: BulletinType[] = await response.json();
				setBulletins(data);
			} catch (err) {
				setError("Error al cargar los eventos");
			} finally {
				setLoading(false);
			}
		};

		loadBulletins();
	}, []);

	const handleAddBulletin = (newBulletin: BulletinType) => {
		setBulletins((prev) => [...prev, newBulletin]);
		setIsAddModalOpen(false);
	};

	const handleUpdateBulletin = (updatedBulletin: BulletinType) => {
		setBulletins((prev) =>
			prev.map((bulletin) =>
				bulletin.idTipPre === updatedBulletin.idTipPre ? updatedBulletin : bulletin
			)
		);
		setSelectedBulletin(null);
		setIsUpdateModalOpen(false);
	};

	const openUpdateModal = (bulletin: BulletinType) => {
		setSelectedBulletin(bulletin);
		setIsUpdateModalOpen(true);
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-7">Gestión de Boletines</h1>

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
					{bulletins.map((bulletin) => (
						<BulletinCard
							key={bulletin.idTipPre}
							foto={bulletin.foto}
							titulo={bulletin.titulo}
							subtitulo={bulletin.subtitulo}
							descripcion={bulletin.descripcion}
							idioma={bulletin.descripcionIdioma}
							openUpdateModal={() => openUpdateModal(bulletin)}
						/>
					))}
				</div>

				<div className="w-1/3 flex flex-col gap-y-4 mx-4">
					<div
						className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl"
						onClick={() => setShowForm(!showForm)}
					>
						<h3 className="text-lg font-semibold">Agregar Boletín</h3>
						<Plus size={50} />
					</div>
					{showForm && (
						<EditBulletinForm
							open={isAddModalOpen}
							onClose={() => setIsAddModalOpen(false)}
							onAdd={handleAddBulletin}
						/>
					)}
				</div>
			</div>
			{isUpdateModalOpen && selectedBulletin && (
				<UpdateBulletinModal
					bulletin={selectedBulletin}
					onUpdate={handleUpdateBulletin}
					open={isUpdateModalOpen}
					onClose={() => setIsUpdateModalOpen(false)}
				/>
			)}
		</div>
	);
}
