import { useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { NewEventType } from "@/types/createEvent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HomeLayout from "@/components/HomeLayout";

export default function NewEvent() {
	const { addEvent } = useEventStore();
	const [formData, setFormData] = useState<NewEventType>({
		des_event: "",
		color: "",
		subcolor: "",
		image: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData((prev) => ({ ...prev, image: reader.result as string }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addEvent(formData);
		setFormData({ des_event: "", color: "", subcolor: "", image: "" });
	};

	return (
		<HomeLayout>
			<form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
                <h1>Crear Evento</h1>
				<Input
					name="des_event"
					placeholder="Nombre del evento"
					value={formData.des_event}
					onChange={handleChange}
					required
				/>
				<Input
					name="color"
					type="color"
					value={formData.color|| "#000000"}
					onChange={handleChange}
				/>
				<Input
					name="subcolor"
					type="color"
					value={formData.subcolor || "#000000"}
					onChange={handleChange}
				/>
				<input type="file" accept="image/*" onChange={handleImageChange} />
				{formData.image && (
					<img src={formData.image} alt="Preview" className="w-32 h-32 mt-2" />
				)}
				<Button type="submit">Crear Evento</Button>
			</form>
		</HomeLayout>
	);
}
