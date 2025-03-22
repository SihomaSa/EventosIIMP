import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchExpositors } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpositorType } from "@/types/expositorTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import EditExpositorsModal from "@/components/expositors/EditExpositorsForm";
import UpdateExpositorsForm from "@/components/expositors/UpdateExpositorsForm";

export default function Expositors() {
	const [expositors, setExpositors] = useState<ExpositorType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const [expositorsMock, setExpositorsMock] = useState<ExpositorType[]>([]);
	const [formMode, setFormMode] = useState<"view" | "add" | "update">("view");
	const [selectedExpositor, setSelectedExpositor] =
		useState<ExpositorType | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		const loadExpositors = async () => {
			try {
				const response = await fetch(
					"https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/author"
				); // Reemplaza con tu URL real
				if (!response.ok) throw new Error("Error al obtener conferencistas");

				const data: ExpositorType[] = await response.json();
				setExpositors(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los eventos");
			} finally {
				setLoading(false);
			}
		};

		const loadExpositorsMock = async () => {
			try {
				const data = await fetchExpositors();
				setExpositorsMock(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los mocks de conferencistas");
			}
		};

		loadExpositors();
		loadExpositorsMock();
	}, []);

	const handleAddExpositor = (newExpositor: ExpositorType) => {
		setExpositors((prev) => [...prev, newExpositor]);
		setIsAddModalOpen(false); // Cierra el modal después de agregar
	};

	const handleUpdateExpositor = (updatedExpositor: ExpositorType) => {
		setExpositors((prev) =>
			prev.map((expositor) =>
				expositor.idautor === updatedExpositor.idautor
					? updatedExpositor
					: expositor
			)
		);
		setFormMode("view");
		setSelectedExpositor(null);
	};

	const toggleForm = (mode: "view" | "add" | "update") => {
		setFormMode(mode);
		if (mode === "add") {
			setIsAddModalOpen(true);
		} else {
			setIsAddModalOpen(false);
			setSelectedExpositor(null);
		}
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Gestión de Conferencistas</h1>
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

			{/* Vista en dos columnas cuando se está actualizando */}
			<div
				className={`flex w-full ${
					formMode === "update" ? "flex-row gap-6" : "flex-col items-center"
				}`}
			>
				{/* Lista de conferen */}
				<div
					className={`${
						formMode === "update"
							? "w-1/3 gap-4"
							: "flex flex-wrap gap-4 justify-center"
					}`}
				>
					{expositors.map((expo) => {
						if (formMode !== "view") {
							return (
								<Card
									key={expo.idautor}
									className={`shadow-md overflow-hidden cursor-pointer p-2 max-w-xs max-h-70 truncate
								${
									formMode === "update"
										? selectedExpositor?.idautor === expo.idautor
											? "flex w-full border-2 border-primary"
											: "flex w-full grayscale"
										: ""
								}
							  `}
									onClick={() => {
										if (formMode === "update" ) {
											setSelectedExpositor(expo);
										}
									}}
								>
									<CardContent className="overflow-hidden max-w-full">
										<Avatar className="size-20 justify-self-center">
											<AvatarImage src={expositorsMock[0].image} />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<div className="p-2 text-center">
											<p className="text-gray-500">URL: {expo.nombres}</p>
											<p className="text-gray-500">
												Apellidos: {expo.apellidos}
											</p>
											<p className="text-gray-500">
												Frase: {expo.especialidad}
											</p>
											<p className="text-gray-500 truncate">
												Hoja: {expo.hojavida}
											</p>
										</div>
									</CardContent>
								</Card>
							);
						} else {
							return (
								<Card
									key={expo.idautor}
									className="shadow-md overflow-hidden p-4 w-80"
								>
									<CardContent>
										<img
											src={expositorsMock[0].image}
											alt={`conferencista ${expo.nombres}`}
											className="object-cover h-auto max-h-full rounded-md"
										/>
										<form className="p-2 space-y-2">
											<div>
												<Label htmlFor="nombres">Nombres</Label>
												<Input
													id="nombres"
													value={expo.nombres}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="apellidos">Apellidos</Label>
												<Input
													id="apellidos"
													value={expo.apellidos}
													disabled
													className="bg-gray-100"
												/>
											</div>
											<div>
												<Label htmlFor="hojavida">Hoja de Vida</Label>
												<Input
													id="hojavida"
													value={expo.hojavida}
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
				{formMode === "update" && selectedExpositor && (
					<div className="w-2/3 flex justify-center h-full">
						<UpdateExpositorsForm
							expositor={selectedExpositor}
							onUpdate={handleUpdateExpositor}
						/>
					</div>
				)}
				{formMode === "update" && !selectedExpositor && (
					<div className="w-2/3">
						<Card className="bg-stone-400 text-white text-2xl">
							Seleccione un Conferencista
						</Card>
					</div>
				)}
			</div>

			{/* Modal para agregar publicidad */}
			<EditExpositorsModal
				open={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={handleAddExpositor}
			/>
		</div>
	);
}
