import { useState, useEffect } from "react";
import { SponsorType } from "../types/sponsorTypes";
import { fetchSponsors } from "@/services/api";
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
import EditSponsorsModal from "@/components/sponsors/EditSponsorsForm";
import UpdateSponsorsForm from "@/components/sponsors/UpdateSponsorsForm";

export default function Sponsors() {
	const [sponsors, setSponsors] = useState<SponsorType[]>([]);
	const [sponsorMocks, setSponsorsMocks] = useState<SponsorType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [formMode, setFormMode] = useState<"view" | "add" | "update">("view");
	const [selectedSponsor, setSelectedSponsor] = useState<SponsorType | null>(
		null
	);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		const loadSponsors = async () => {
			try {
				const response = await fetch(
					"https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/sponsor/event/1"
				); // Reemplaza con tu URL real
				if (!response.ok) throw new Error("Error al obtener eventos");

				const data: SponsorType[] = await response.json();
				setSponsors(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los eventos");
			} finally {
				setLoading(false);
			}
		};

		const loadSponsorsMock = async () => {
			try {
				const data = await fetchSponsors();
				setSponsorsMocks(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los mocks de publicidades");
			}
		};

		loadSponsors();
		loadSponsorsMock();
	}, []);

	const handleAddSponsor = (newSponsor: SponsorType) => {
		setSponsors((prev) => [...prev, newSponsor]);
		setIsAddModalOpen(false); // Cierra el modal después de agregar
	};

	const handleUpdateSponsor = (updatedSponsor: SponsorType) => {
		setSponsors((prev) =>
			prev.map((sponsor) =>
				sponsor.idSponsor === updatedSponsor.idSponsor
					? updatedSponsor
					: sponsor
			)
		);
		setFormMode("view");
		setSelectedSponsor(null);
	};

	const toggleForm = (mode: "view" | "add" | "update") => {
		setFormMode(mode);
		if (mode === "add") {
			setIsAddModalOpen(true);
		} else {
			setIsAddModalOpen(false);
			setSelectedSponsor(null);
		}
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Gestión de Auspiciadores</h1>
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
					{sponsors.map((ad) => {
						if (formMode !== "view") {
							return (
								<Card
									key={ad.idSponsor}
									className={`shadow-md overflow-hidden cursor-pointer p-2 w-xs
								${
									formMode === "update"
										? selectedSponsor?.idSponsor === ad.idSponsor
											? "flex w-full border-2 border-primary"
											: "flex w-full grayscale"
										: ""
								}
							  `}
									onClick={() => {
										if (formMode === "update") {
											setSelectedSponsor(ad);
										}
									}}
								>
									<CardContent className="overflow-hidden max-w-full">
										<img
											src={sponsorMocks[0].image}
											alt={`auspiciador ${ad.idSponsor}`}
											className="object-cover h-auto rounded"
										/>
										<div className="p-2 text-center">
											<p className="text-gray-500">URL: {ad.url}</p>
											<p className="text-gray-500">
												Idioma: {ad.descripcionIdioma}
											</p>
											<p className="text-gray-500">
												Categoria: {ad.categoria}
											</p>
										</div>
									</CardContent>
								</Card>
							);
						} else {
							return (
								<Card
									key={ad.idSponsor}
									className="shadow-md overflow-hidden p-4 w-80"
								>
									<CardContent>
										<img
											src={sponsorMocks[0].image}
											alt={`publicidad ${ad.idSponsor}`}
											className="object-cover h-auto max-h-full rounded-md"
										/>
										<form className="p-2 space-y-2">
											<div>
												<Label htmlFor="url">URL</Label>
												<Input
													id="url"
													value={ad.url}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="idioma">Idioma</Label>
												<Input
													id="idioma"
													value={ad.descripcionIdioma}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="estado">Categoria</Label>
												<Input
													id="categoria"
													value={ad.categoria}
													disabled
													className="bg-gray-100"
												/>
											</div>
										</form>
									</CardContent>
								</Card>
							);
						}
					})}
				</div>
				{/* Formulario de actualización */}
				{formMode === "update" && selectedSponsor && (
					<div className="w-2/3 flex justify-center h-full">
						<UpdateSponsorsForm sponsor={selectedSponsor} onUpdate={handleUpdateSponsor} />
					</div>
				)}
				{formMode === "update" && !selectedSponsor && (
					<div className="w-2/3">
						<Card className="bg-stone-400 text-white text-2xl">
							Seleccione una Publicación
						</Card>
					</div>
				)}
			</div>

			{/* Modal para agregar publicidad */}
			<EditSponsorsModal
				open={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={handleAddSponsor}
			/>
		</div>
	);
}
