import { useEffect, useState } from "react";
import { BulletinType } from "../types/bulletinTypes";
import { fetchBullentins } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import EditBulletinForm from "@/components/bulletins/EditBulletinForm";
import UpdateBulletinForm from "@/components/bulletins/UpdateBulletinForm";

export default function Bulletins() {
	const [bulletins, setBulletins] = useState<BulletinType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formMode, setFormMode] = useState<"view" | "add" | "update">("view");
	const [selectedBulletin, setSelectedBulletin] = useState<BulletinType | null>(
		null
	);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		const loadBulletins = async () => {
			try {
				const data = await fetchBullentins();
				setBulletins(data);
			} catch (err) {
				setError("Error al cargar los boletines");
			} finally {
				setLoading(false);
			}
		};

		loadBulletins();
	}, []);

	const handleAddBulletin = (newBulletin: BulletinType) => {
		setBulletins((prev) => [...prev, newBulletin]);
		setIsAddModalOpen(false); // Cierra el modal después de agregar
	};

	const handleUpdateBulletin = (updatedBulletin: BulletinType) => {
		setBulletins((prev) =>
			prev.map((b) => (b.id === updatedBulletin.id ? updatedBulletin : b))
		);
		setFormMode("view");
		setSelectedBulletin(null);
	};

	const toggleForm = (mode: "view" | "add" | "update") => {
		setFormMode(mode);
		if (mode === "add") {
			setIsAddModalOpen(true);
		} else {
			setIsAddModalOpen(false);
			setSelectedBulletin(null);
		}
	};

	if (loading)
		return (
			<div className="flex flex-col items-center justify-center">
				<img
					src="/img/LOGOS_iimp 7.svg"
					alt="Logo de la empresa"
					className="max-w-md text-white py-2"
				/>
				<Loader2 className="animate-spin" />
			</div>
		);
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Gestión de Boletines</h1>

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
					{bulletins.map((bulletin) => (
						<Card
							key={bulletin.id}
							className={`shadow-md overflow-hidden cursor-pointer p-2 
								${
									formMode === "update"
										? selectedBulletin?.id === bulletin.id
											? "flex w-full border-2 border-primary"
											: "flex w-full grayscale"
										: ""
								}
							  `}
							onClick={() => {
								if (formMode === "update") {
									setSelectedBulletin(bulletin);
								}
							}}
						>
							<CardContent>
								<img
									src={bulletin.image}
									alt={bulletin.title}
									className="object-cover w-full h-auto rounded"
								/>
								<div className="p-2 text-center">
									<h2 className="text-xl font-bold">{bulletin.title}</h2>
									<p className="text-gray-500">{bulletin.date}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Formulario de actualización en la derecha */}
				{formMode === "update" && selectedBulletin && (
					<div className="w-2/3 flex justify-center h-full">
						<UpdateBulletinForm
							bulletin={selectedBulletin}
							onUpdate={handleUpdateBulletin}
						/>
					</div>
				)}
				{formMode === "update" && !selectedBulletin && (
					<div className="w-2/3">
						<Card className="bg-stone-400 text-white text-2xl">
							Seleccione un boletin
						</Card>
					</div>
				)}
			</div>

			{/* Modal para agregar boletín */}
			<EditBulletinForm
				open={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={handleAddBulletin}
			/>
		</div>
	);
}
