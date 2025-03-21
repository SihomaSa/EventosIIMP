import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventType } from "@/types/eventTypes";
import { Label } from "../ui/label";

interface EditEventModalProps {
	section: string;
	event: EventType;
	onClose: () => void;
}

export default function EventEditModal({
	section,
	event,
	onClose,
}: EditEventModalProps) {
	const [formData, setFormData] = useState(event);
	const [previewImage, setPreviewImage] = useState<string | null>(event.foto);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	  if (e.target.files && e.target.files[0]) {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
		  setPreviewImage(reader.result as string);
		};
		reader.readAsDataURL(file);
	  }
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		console.log("Saving data:", formData);
		onClose();
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar {section}</DialogTitle>
				</DialogHeader>

				{section === "general" && (
					<div className="space-y-4">
						<Label htmlFor="des_event">Nombre</Label>
						<Input
							name="des_event"
							value={formData.des_event}
							onChange={handleChange}
						/>
						<Label htmlFor="color">Color primario</Label>
						<Input
							name="color"
							value={formData.color}
							onChange={handleChange}
							type="color"
						/>
						<Label htmlFor="subcolor">Color secundario</Label>
						<Input
							name="subcolor"
							value={formData.subcolor}
							onChange={handleChange}
							type="color"
						/>
						<img
							src={previewImage || event.foto}
							alt={event.des_event}
							className="w-full h-60 object-cover rounded"
						/>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
						/>
					</div>
				)}

				{section === "ads" && (
					<div className="space-y-4">
						{formData.ads.map((pub, index) => (
							<div key={index} className="space-y-2">
								<Label htmlFor={`publicidades[${index}].image`}>Imagen</Label>
								<Input
									name={`publicidades[${index}].image`}
									value={pub.foto}
									onChange={handleChange}
								/>
								<Label htmlFor={`publicidades[${index}].url`}>URL</Label>
								<Input
									name={`publicidades[${index}].url`}
									value={pub.url}
									onChange={handleChange}
								/>
							</div>
						))}
					</div>
				)}

				{section === "press" && (
					<div className="space-y-4">
						{formData.pressNotes.map((nota, index) => (
							<div key={index} className="space-y-2">
								<Label htmlFor={`notasPrensa[${index}].title`}>Título</Label>
								<Input
									name={`notasPrensa[${index}].title`}
									value={nota.title}
									onChange={handleChange}
								/>
								<Label htmlFor={`notasPrensa[${index}].date`}>Fecha</Label>
								<Input
									name={`notasPrensa[${index}].date`}
									value={nota.date}
									onChange={handleChange}
									type="date"
								/>
								<Label htmlFor={`notasPrensa[${index}].url`}>URL</Label>
								<Input
									name={`notasPrensa[${index}].url`}
									value={nota.url}
									onChange={handleChange}
								/>
							</div>
						))}
					</div>
				)}

				<DialogFooter>
					<Button onClick={onClose} variant="outline">
						Cancelar
					</Button>
					<Button onClick={handleSave}>Guardar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
