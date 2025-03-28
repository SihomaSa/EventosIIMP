import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { deleteAd } from "../services/adsService";
import { useState } from "react";

interface AdCardProps {
	id: number;
	foto: string;
	url: string;
	idioma: string;
	openUpdateModal: () => void;
	onDelete: () => void;
}

export default function AdCard({
	id,
	foto,
	url,
	idioma,
	openUpdateModal,
	onDelete,
}: AdCardProps) {

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
const deleteSelectedAd = async (id: number) => {
	console.log("nooooooo", loading, id);
	try {
		await deleteAd(String(id));
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		setError("Error al borrar la publicidad");
		console.error(error)
	} finally {
		setLoading(false);
	}
};
	return (
		<Card className="shadow-md overflow-hidden py-4 w-80 hover:shadow-2xl transition delay-150 duration-300 ease-in-out hover:scale-110">
			<CardContent>
				<img
					src={foto}
					alt={`publicidad ${id}`}
					className="object-cover h-auto max-h-full rounded-md"
				/>
				<form className="p-2 space-y-2">
					<div>
						<Label htmlFor="url">URL</Label>
						<Input id="url" value={url} disabled className="bg-gray-100" />
					</div>
					<div>
						<Label htmlFor="idioma">Idioma</Label>
						<Input
							id="idioma"
							value={idioma}
							disabled
							className="bg-gray-100"
						/>
					</div>
					<div className="flex justify-between py-3">
						<Button
							variant={"outline"}
							onClick={() => {
								deleteSelectedAd(id);
								onDelete();
							}}
						>
							<Trash2 /> Eliminar
						</Button>
						<Button
							onClick={(event) => {
								event.preventDefault(); // Previene la recarga de la página
								openUpdateModal();
							}}
						>
							<Pencil />
							Editar
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
