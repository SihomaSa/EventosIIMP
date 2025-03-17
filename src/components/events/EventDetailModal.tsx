import { useState } from "react";
import EventEditModal from "./EventEditModal";
import { EventType } from "../../types/eventTypes";

interface Event {
	idEvent: string;
	des_event: string;
	foto: string;
	estado: string;
	subcolor: string;
	color: string;
}

interface EventDetailModalProps {
	event: EventType;
	onClose: () => void;
	onUpdate: (updatedEvent: Event) => void;
}

export default function EventDetailModal({
	event,
	onClose,
	onUpdate,
}: EventDetailModalProps) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<div className="fixed inset-0 flex items-center justify-center bg-black/40">
				<div className="bg-white p-6 rounded-lg shadow-lg w-96">
					<h2 className="text-xl font-bold mb-4">Detalles del Evento</h2>

					{/* Título del evento */}
					<p className="text-lg font-semibold mb-2">{event.des_event}</p>

					{/* Imagen del evento */}
					{event.foto ? (
						<img
							src={event.foto}
							alt="Imagen del evento"
							className="w-full h-40 object-cover border rounded mb-2"
						/>
					) : (
						<div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-2">
							Sin imagen disponible
						</div>
					)}

					{/* Colores del evento */}
					<div className="flex justify-between items-center mt-4">
						<div className="flex flex-col items-center">
							<p className="text-sm text-gray-600 mb-1">Color Primario</p>
							<div
								className="w-10 h-10 rounded border"
								style={{ backgroundColor: event.color || "#c39254" }}
							></div>
						</div>

						<div className="flex flex-col items-center">
							<p className="text-sm text-gray-600 mb-1">Color Secundario</p>
							<div
								className="w-10 h-10 rounded border"
								style={{ backgroundColor: event.subcolor || "#ebdbc6" }}
							></div>
						</div>
					</div>

					<div className="mt-4 flex justify-between">
						<button
							className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition"
							onClick={onClose}
						>
							Cerrar
						</button>

						<button
							className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
							onClick={() => setIsEditing(true)}
						>
							Editar
						</button>
					</div>
				</div>
			</div>
			{isEditing && (
				<EventEditModal
					event={event}
					onClose={() => {
						setIsEditing(false);
						onClose();
					}}
					onSave={(updatedEvent) => {
						onUpdate(updatedEvent);
						setIsEditing(false);
					}}
				/>
			)}
		</>
	);
}
