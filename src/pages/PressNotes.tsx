import { useEffect, useState } from "react";
import { PressNoteType } from "../types/pressNoteTypes";
import { fetchPressNotes } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PressNotes() {
	const [pressNotes, setPressNotes] = useState<PressNoteType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadPressNotes = async () => {
			try {
				const data = await fetchPressNotes(); // Simula la llamada a la API
				setPressNotes(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar las notas de prensa");
			} finally {
				setLoading(false);
			}
		};

		loadPressNotes();
	}, []);

	if (loading) return <p>Cargando notas de prensa...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="flex-1 p-6">
			<h1 className="font-bold mb-4">Gestión de Boletines</h1>
			<Button className="mb-4">Agregar Boletín</Button>
			<div className="flex flex-wrap gap-4 justify-center">
				{pressNotes.map((note) => (
					<Card
						key={note.id}
						className="rounded-lg shadow-md overflow-hidden cursor-pointer p-2 w-65 max-w-65"
						onClick={() =>
							window.open(note.url, "_blank", "noopener,noreferrer")
						}
					>
						<img
							src={note.image}
							alt={note.title}
							className="object-cover w-full h-40 rounded-lg"
						/>
						<div className="p-2 text-center h-full flex flex-col justify-between">
							<h3 className="text-lg text-left font-semibold leading-5">
								{note.title}
							</h3>
							<p className="text-gray-500 text-sm text-left line-clamp-3">
								{note.date}
							</p>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
