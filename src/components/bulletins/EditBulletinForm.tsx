import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { BulletinType } from "@/types/bulletinTypes";

export default function EditBulletinForm({ onAdd }: { onAdd: (newBulletin: BulletinType) => void }) {
	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");
	const [url, setUrl] = useState("");
	const date = format(new Date(), "yyyy-MM-dd"); // Fecha actual

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newBulletin: BulletinType = {
			id: crypto.randomUUID(), // Genera un ID único
			title,
			image,
			date,
			url,
		};
		onAdd(newBulletin);
		setTitle("");
		setImage("");
		setUrl("");
	};

	return (
		<div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
			<h2 className="text-lg font-bold mb-4">Agregar Boletín</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Label htmlFor="title">Título</Label>
					<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
				</div>
				<div>
					<Label htmlFor="image">Imagen (URL)</Label>
					<Input id="image" value={image} onChange={(e) => setImage(e.target.value)} required />
				</div>
				<div>
					<Label htmlFor="url">Enlace</Label>
					<Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
				</div>
				<p className="text-sm text-gray-500">Fecha de creación: {date}</p>
				<Button type="submit" className="w-full">Guardar</Button>
			</form>
		</div>
	);
}
