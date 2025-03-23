import { useEffect, useState } from "react";
import { AdType } from "../types/adTypes";
import { fetchAds } from "@/services/api";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import EditAdsModal from "@/components/ads/EditAdsForm";
import UpdateAdsForm from "@/components/ads/UpdateAdsForm";

export default function Ads() {
	const [ads, setAds] = useState<AdType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [adsMock, setAdsMock] = useState<AdType[]>([]);
	const [formMode, setFormMode] = useState<"view" | "add" | "update">("view");
	const [selectedAd, setSelectedAd] = useState<AdType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		const loadAds = async () => {
			try {
				const response = await fetch(
					"https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/advertising/event/1"
				); // Reemplaza con tu URL real
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

		const loadAdsMock = async () => {
			try {
				const data = await fetchAds();
				setAdsMock(data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los mocks de publicidades");
			}
		};

		loadAds();
		loadAdsMock();
	}, []);

	const handleAddAd = (newAd: AdType) => {
		setAds((prev) => [...prev, newAd]);
		setIsAddModalOpen(false); // Cierra el modal después de agregar
	};

	const handleUpdateAd = (updatedAd: AdType) => {
		setAds((prev) =>
			prev.map((ad) =>
				ad.idPublicidad === updatedAd.idPublicidad ? updatedAd : ad
			)
		);
		setFormMode("view");
		setSelectedAd(null);
	};

	const toggleForm = (mode: "view" | "add" | "update") => {
		setFormMode(mode);
		if (mode === "add") {
			setIsAddModalOpen(true);
		} else {
			setIsAddModalOpen(false);
			setSelectedAd(null);
		}
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Gestión de Publicidades</h1>

			{/* Menú de navegación */}
			<NavigationMenu className="p-1 m-3 self-end bg-white rounded-xl">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger
							className="hover:bg-secondary"
							onClick={() => toggleForm("view")}
						>
							Visualizar
						</NavigationMenuTrigger>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger onClick={() => toggleForm("add")}>
							Agregar
						</NavigationMenuTrigger>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger onClick={() => toggleForm("update")}>
							Actualizar
						</NavigationMenuTrigger>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			{loading && (
				<div className="flex flex-col items-center justify-center">
					<img
						src="/img/LOGOS_iimp 7.svg"
						alt="Logo de la empresa"
						className="max-w-md text-white py-2"
					/>
					<Loader2 className="animate-spin" />
				</div>
			)}

			{/* Vista de publicidades */}
			{/* <div className="space-x-4 flex flex-col py-4 justify-center items-center">
				{ads.map((ad) => (
					<div key={ad.idPublicidad} className="flex justify-center items-center py-2 m-0">
						<div className="h-full border rounded-xl overflow-hidden cursor-pointer flex items-center justify-around mr-4">
							<img src={adsMock[0].foto} alt={`Ad ${ad.idPublicidad}`} className="object-cover w-full h-auto" />
						</div>
						<a className="border-2 border-amber-900 p-2 rounded-lg" target="_blank" rel="noopener noreferrer">
							{ad.url}
						</a>
					</div>
				))}
			</div> */}

			{/* Vista en dos columnas cuando se está actualizando */}
			<div
				className={`flex w-full ${
					formMode === "update" ? "flex-row gap-6" : "flex-col items-center"
				}`}
			>
				{/* Lista de boletines */}
				<div
					className={`${
						formMode === "update"
							? "w-1/3 gap-4"
							: "flex flex-wrap gap-4 justify-center"
					}`}
				>
					{ads.map((ad) => (
								<Card key={ad.idPublicidad} className="shadow-md overflow-hidden p-4 w-80">
								<CardContent>
								  <img
									src={adsMock[0].foto}
									alt={`publicidad ${ad.idPublicidad}`}
									className="object-cover h-auto max-h-full rounded-md"
								  />
								  <form className="p-2 space-y-2">
									<div>
									  <Label htmlFor="url">URL</Label>
									  <Input id="url" value={ad.url} disabled className="bg-gray-100" />
									</div>
									<div>
									  <Label htmlFor="idioma">Idioma</Label>
									  <Input id="idioma" value={ad.descripcionIdioma} disabled className="bg-gray-100" />
									</div>
									<div>
									  <Label htmlFor="estado">Estado</Label>
									  <Input id="estado" value={ad.estado} disabled className="bg-gray-100" />
									</div>
								  </form>
								</CardContent>
							  </Card>
							
				
					))}
				</div>
			{/* Formulario de actualización */}
			{formMode === "update" && selectedAd && (
				<div className="w-2/3 flex justify-center h-full">
					<UpdateAdsForm ad={selectedAd} onUpdate={handleUpdateAd} />
				</div>
			)}
							{formMode === "update" && !selectedAd && (
					<div className="w-2/3">
						<Card className="bg-stone-400 text-white text-2xl">
							Seleccione una Publicación
						</Card>
					</div>
				)}
				</div>


			{/* Modal para agregar publicidad */}
			<EditAdsModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddAd} />
		</div>
	);
}
