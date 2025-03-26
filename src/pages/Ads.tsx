import { useEffect, useState } from "react";
import { AdType } from "../types/adTypes";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AdCard from "@/components/ads/AdCard";
import UpdateAdsModal from "@/components/ads/UpdateAdsModal";
import EditAdsForm from "@/components/ads/EditAdsForm";

import { getAds } from "@/components/services/adsService";

export default function Ads() {
	const [ads, setAds] = useState<AdType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedAd, setSelectedAd] = useState<AdType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [adsUpdated, setAdsUpdated] = useState(0);

	useEffect(() => {
		const fetchAds = async () => {
			try {
				const data = await getAds();
				setAds(data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al obtener los publicidades");
			} finally {
				setLoading(false);
			}
		};

		fetchAds();
	}, [adsUpdated]);

	const handleAddAd = () => {
		setAdsUpdated((prev) => prev + 1); // Cambia el estado para volver a ejecutar useEffect
		setIsAddModalOpen(false);
	};

	const handleUpdateAd = (updatedAd: AdType) => {
		setAds((prev) =>
			prev.map((ad) =>
				ad.idPublicidad === updatedAd.idPublicidad ? updatedAd : ad
			)
		);
		setSelectedAd(null);
		setIsUpdateModalOpen(false);
	};

	const openUpdateModal = (ad: AdType) => {
		setSelectedAd(ad);
		setIsUpdateModalOpen(true);
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-7">Gestión de Publicidades</h1>

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
					{ads.map((ad, index) => (
						<AdCard
							key={index}
							id={ad.idPublicidad}
							foto={ad.foto}
							url={ad.url}
							idioma={ad.descripcionIdioma}
							openUpdateModal={() => openUpdateModal(ad)}
						/>
					))}
				</div>

				<div className="w-1/3 flex flex-col gap-y-4 mx-4">
					<div
						className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl"
						onClick={() => setIsAddModalOpen(!isAddModalOpen)}
					>
						<h3 className="text-lg font-semibold">Agregar Publicación</h3>
						<Plus size={50} />
					</div>
					{isAddModalOpen && (
						<EditAdsForm
							open={isAddModalOpen}
							onClose={() => setIsAddModalOpen(false)}
							onAdd={handleAddAd}
						/>
					)}
				</div>
			</div>
			{isUpdateModalOpen && selectedAd && (
				<UpdateAdsModal
					ad={selectedAd}
					onUpdate={handleUpdateAd}
					onAdd={handleAddAd} // <- Añadido si realmente se usa en el modal
					open={isUpdateModalOpen}
					onClose={() => setIsUpdateModalOpen(false)}
				/>
			)}
		</div>
	);
}
