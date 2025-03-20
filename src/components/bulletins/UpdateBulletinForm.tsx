import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BulletinType } from "@/types/bulletinTypes";

export default function UpdateBulletinForm({ bulletin, onUpdate }: { bulletin: BulletinType, onUpdate: (updated: BulletinType) => void }) {
	const [title, setTitle] = useState(bulletin.title);
	const [image, setImage] = useState(bulletin.image);
	const [url, setUrl] = useState(bulletin.url);
	const date = bulletin.date; // Mantiene la fecha original

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const updatedBulletin = { ...bulletin, title, image, url };
		onUpdate(updatedBulletin);
	};

	return (
		<div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
			<h2 className="text-lg font-bold mb-4">Actualizar Boletín</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Label>ID (No editable)</Label>
					<p className="bg-gray-100 text-gray-500 p-2 rounded">{bulletin.id}</p>
				</div>
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
				<Button type="submit" className="w-full">Actualizar</Button>
			</form>
		</div>
	);
}
