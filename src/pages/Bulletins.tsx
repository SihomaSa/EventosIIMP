import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import UpdateBulletinModal from "@/components/bulletins/UpdateBulletinModal";
import EditBulletinForm from "@/components/bulletins/EditBulletinForm";
import BulletinCard from "@/components/bulletins/BulletinCard";
import { BulletinType } from "@/types/bulletinTypes";

import { getBulletins } from "@/components/services/bulletinsService";

export default function Bulletins() {
	const [bulletins, setBulletins] = useState<BulletinType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedBulletin, setSelectedBulletin] = useState<BulletinType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [bulletinsUpdated, setBulletinsUpdated] = useState(0);

	useEffect(() => {
		const fetchBulletins = async () => {
			try {
				const data = await getBulletins();
				setBulletins(data?.filter((bulletin) => bulletin.idTipPre === 1) || []);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al obtener los boletines");
			} finally {
				setLoading(false);
			}
		};

		fetchBulletins();
	}, [bulletinsUpdated]);

	const handleAddBulletin = () => {
		setBulletinsUpdated((prev) => prev + 1);
		setIsAddModalOpen(false);
	};

	const handleUpdateBulletin = () => {
		setBulletinsUpdated((prev) => prev + 1);
		setSelectedBulletin(null);
		setIsUpdateModalOpen(false);
	};

	const openUpdateModal = (bulletin: BulletinType) => {
		setSelectedBulletin(bulletin);
		setIsUpdateModalOpen(true);
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-3 md:p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-7">Gestión de Boletines</h1>

			<div className="flex flex-col-reverse md:flex-row w-full h-full">
				<div className="flex flex-wrap gap-4 justify-center  md:w-2/3">
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
					{bulletins?.length ? (
					bulletins.map((bulletin, index) => (
						<BulletinCard
						key={index}
						foto={bulletin.foto}
						titulo={bulletin.titulo}
						descripcion={bulletin.descripcion}
						idioma={bulletin.descripcionIdioma}
						openUpdateModal={() => openUpdateModal(bulletin)}
						/>
					))
					) : (
					<p className="text-gray-500">No hay boletines disponibles</p>
					)}

				</div>

				<div className="md:w-1/3 flex flex-col gap-y-4 mx-4 mb-4">
					<div
						className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl"
						onClick={() => setIsAddModalOpen(!isAddModalOpen)}
					>
						<h3 className="text-lg font-semibold">Agregar Boletín</h3>
						<Plus size={50} />
					</div>
					{isAddModalOpen && (
						<EditBulletinForm
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
