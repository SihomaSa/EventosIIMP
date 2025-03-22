import { useEffect, useState } from "react";
import { PressNoteType } from "@/types/pressNoteTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import EditPressModal from "@/components/press/EditPressForm";
import UpdatePressForm from "@/components/press/UpdatePressForm";
import { fetchPressNotes } from "@/services/api";


export default function PressNotes() {
	const [pressNotes, setPressNotes] = useState<PressNoteType[]>([]);
	const [pressNotesMock, setPressNotesMock] = useState<PressNoteType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formMode, setFormMode] = useState<"view" | "add" | "update">("view");
	const [selectedPressNote, setSelectedPressNote] = useState<PressNoteType | null>(
		null
	);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		const loadPressNotes = async () => {
			try {
				const response = await fetch(
					"https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/news/event/1"
				); // Reemplaza con tu URL real
				if (!response.ok) throw new Error("Error al obtener eventos");

				const data: PressNoteType[] = await response.json();
				setPressNotes(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los eventos");
			} finally {
				setLoading(false);
			}
		};

		const loadpressNotesMock = async () => {
			try {
				const data = await fetchPressNotes();
				setPressNotesMock(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar las mocks de boletines");
			}
		};

		loadPressNotes();
		loadpressNotesMock();
	}, []);

	const handleAddPressNote = (newPressNote: PressNoteType) => {
		setPressNotes((prev) => [...prev, newPressNote]);
		setIsAddModalOpen(false); // Cierra el modal después de agregar
	};

	const handleUpdatePressNote = (updatedPressNote: PressNoteType) => {
		setPressNotes((prev) =>
			prev.map((b) =>
				b.idTipPre === updatedPressNote.idTipPre ? updatedPressNote : b
			)
		);
		setFormMode("view");
		setSelectedPressNote(null);
	};

	const toggleForm = (mode: "view" | "add" | "update") => {
		setFormMode(mode);
		if (mode === "add") {
			setIsAddModalOpen(true);
		} else {
			setIsAddModalOpen(false);
			setSelectedPressNote(null);
		}
	};

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="p-6 flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Gestión de Notas de Prensa</h1>

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
				{/* Lista de boletines */}
				<div
					className={`${
						formMode === "update"
							? "w-1/3 gap-4"
							: "flex flex-wrap gap-4 justify-center"
					}`}
				>
					{pressNotes.map((note) => {
						if (formMode !== "view") {
							return (
								<Card
									key={note.idTipPre}
									className={`shadow-md overflow-hidden cursor-pointer p-2 w-xs
								${
									formMode === "update"
										? selectedPressNote?.idTipPre === note.idTipPre
											? "flex w-full border-2 border-primary"
											: "flex w-full grayscale"
										: ""
								}
							  `}
									onClick={() => {
										if (formMode === "update") {
											setSelectedPressNote(note);
										}
									}}
								>
									<CardContent className="overflow-hidden">
										<img
											src={pressNotesMock[1].foto}
											alt={note.titulo}
											className="object-cover w-full h-auto rounded"
										/>
										<div className="p-2 text-center">
											<h2 className="text-xl font-bold">{note.titulo}</h2>
											<p className="text-gray-500">
												Idioma: {note.descripcionIdioma}
											</p>
										</div>
									</CardContent>
								</Card>
							);
						} else {
							return (
								<Card key={note.idTipPre} className="shadow-md overflow-hidden p-4 w-80">
								<CardContent>
								  <img
									src={pressNotesMock[1].foto}
									alt={note.titulo}
									className="object-cover w-full h-40 rounded-md"
								  />
								  <form className="p-2 space-y-2">
									<div>
									  <Label htmlFor="titulo">Título</Label>
									  <Input id="titulo" value={note.titulo} disabled className="bg-gray-100" />
									</div>
									<div>
									  <Label htmlFor="subtitulo">Subtítulo</Label>
									  <Input id="subtitulo" value={note.subtitulo} disabled className="bg-gray-100" />
									</div>
									<div>
									  <Label htmlFor="descripcion">Descripción</Label>
									  <Input id="descripcion" value={note.descripcion} disabled className="bg-gray-100" />
									</div>
									<div>
									  <Label htmlFor="idioma">Idioma</Label>
									  <Input id="idioma" value={note.descripcionIdioma} disabled className="bg-gray-100" />
									</div>
								  </form>
								</CardContent>
							  </Card>
							);
						}
					})}
				</div>

				{/* Formulario de actualización en la derecha */}
				{formMode === "update" && selectedPressNote && (
					<div className="w-2/3 flex justify-center h-full">
						<UpdatePressForm
							pressNote={selectedPressNote}
							onUpdate={handleUpdatePressNote}
						/>
					</div>
				)}
				{formMode === "update" && !selectedPressNote && (
					<div className="w-2/3">
						<Card className="bg-stone-400 text-white text-2xl">
							Seleccione un boletin
						</Card>
					</div>
				)}
			</div>

			{/* Modal para agregar boletín */}
			<EditPressModal
				open={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={handleAddPressNote}
			/>
		</div>
	);
}
