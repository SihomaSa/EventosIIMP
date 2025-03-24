import { useEffect, useState } from "react";
import { AdType } from "../types/adTypes";
import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import AdCard from "@/components/ads/AdCard";
import UpdateAdsModal from "@/components/ads/UpdateAdsModal";
import EditAdsForm from "@/components/ads/EditAdsForm";

export default function Ads() {
	const [ads, setAds] = useState<AdType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedAd, setSelectedAd] = useState<AdType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

	useEffect(() => {
		const loadAds = async () => {
			try {
				const response = await fetch(
					"https://xahhfxc3dc.execute-api.us-east-1.amazonaws.com/web/advertising/event/1"
				);
				if (!response.ok) throw new Error("Error al obtener eventos");

				const data: AdType[] = await response.json();
				setAds(data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los eventos");
			} finally {
				setLoading(false);
			}
		};

		loadAds();
	}, []);

	const handleAddAd = (newAd: AdType) => {
		setAds((prev) => [...prev, newAd]);
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
					{ads.map((ad) => (
						<AdCard
							key={ad.idPublicidad}
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
						onClick={() => setShowForm(!showForm)}
					>
						<h3 className="text-lg font-semibold">Agregar Publicación</h3>
						<Plus size={50} />
					</div>
					{showForm && (
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
