import { useState } from "react";
import { EventType } from "../../types/eventTypes";

interface EditEventModalProps {
	event: EventType;
	onClose: () => void;
	onSave: (updatedEvent: EventType) => void;
}

export default function EditEventModal({
	event,
	onClose,
	onSave,
}: EditEventModalProps) {
	const [formData, setFormData] = useState(event);
	const [imagePreview, setImagePreview] = useState<string | null>(
		event.foto || null
	);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Actualiza el preview
		if (name === "foto") {
			setImagePreview(value);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/40">
			<div className="bg-white p-6 rounded-lg shadow-lg w-96">
				<h2 className="text-xl font-bold mb-4">Editar Evento</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						name="des_event"
						value={formData.des_event}
						onChange={handleChange}
						className="w-full p-2 border rounded mb-2"
						placeholder="Título"
					/>
					<label className="w-full border border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition">
						<svg
							className="w-10 h-10 text-gray-500"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4v16m8-8H4"
							></path>
						</svg>
						<p className="text-gray-700 text-sm mt-2">Subir imagen</p>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									const reader = new FileReader();
									reader.onload = () =>
										setImagePreview(reader.result as string);
									reader.readAsDataURL(file);
								}
							}}
							className="hidden"
						/>
					</label>

					{imagePreview && (
						<div className="mt-2">
							<p className="text-sm text-gray-500">Vista previa:</p>
							<img
								src={imagePreview}
								alt="Vista previa"
								className="w-full h-40 object-cover border rounded"
							/>
						</div>
					)}

					<div className="flex flex-col w-1/2">
						<label className="text-sm text-gray-600 mb-1">Color primario</label>
						<input
							type="color"
							name="color"
							value={formData.color}
							onChange={handleChange}
							className="w-full h-10 border rounded cursor-pointer"
						/>
					</div>

					<div className="flex flex-col w-1/2">
						<label className="text-sm text-gray-600 mb-1">
							Color secundario
						</label>
						<input
							type="color"
							name="subcolor"
							value={formData.subcolor}
							onChange={handleChange}
							className="w-full h-10 border rounded cursor-pointer"
						/>
					</div>

					<div className="flex justify-between mt-4">
						<button
							type="button"
							className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
							onClick={onClose}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900"
						>
							Guardar Cambios
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
