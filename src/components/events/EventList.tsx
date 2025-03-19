import { Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { fetchEvents } from "../../services/api";
import { EventType } from "../../types/eventTypes";
import { Button } from "../ui/button";
import { NewEventType } from "@/types/createEvent";

export default function EventList() {
	const { selectEvent } = useEventStore();

	const [events, setEvents] = useState<EventType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [showForm, setShowForm] = useState(false);
	const [newEvent, setNewEvent] = useState<NewEventType>({
		color: "",
		subcolor: "",
		image: "",
	});

	useEffect(() => {
		const loadEvents = async () => {
			try {
				const data = await fetchEvents();
				setEvents(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los eventos");
			} finally {
				setLoading(false);
			}
		};

		loadEvents();
	}, []);

	if (loading)
		return (
			<div className="flex flex-col items-center justify-center">
				<img src="/img/LOGOS_iimp 7.svg" alt="Logo de la empresa" className="max-w-md text-white py-2" />
				<Loader2 className="animate-spin" />
			</div>
		);
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="h-screen w-screen py-9 px-9 max-w-md m-auto overflow-y-scroll overflow-x-hidden">
			<h2 className="text-2xl font-bold mb-4">
				Selecciona el evento que administrar
			</h2>

			<div className="flex justify-center items-center gap-x-2 py-9">
				{events.map((event, index) => (
					<Link
						key={index}
						to={`/home/sponsors`}
						onClick={() => selectEvent(event)}
					>
						<div
							key={index}
							className="w-20 h-20 border-3 border-[#C09054] rounded-lg shadow-xl flex items-center"
						>
							<img
								src={event.foto}
								alt="evento logo"
								className="object-cover p-2 w-full h-auto"
							/>
						</div>
					</Link>

					// <div
					// 	key={event.idEvent}
					// 	className="bg-white shadow-md rounded-xl border border-amber-800 overflow-hidden w-full max-w-md"
					// >
					// 	<div
					// 		className="relative overflow-hidden"
					// 		style={{ maxHeight: "200px" }}
					// 	>
					// 		<img
					// 			src={event.foto}
					// 			// src={"https://placehold.co/600x400"}
					// 			alt="Imagen de prueba"
					// 			className="w-full object-cover opacity-80"
					// 		/>
					// 	</div>
					// 	<div className="p-4 text-center">
					// 		<h3 className="text-lg font-semibold">{event.des_event}</h3>
					// 		<div className="flex justify-center mt-2">
					// 			<span
					// 				className="w-6 h-6 rounded-full"
					// 				style={{ backgroundColor: event.color }}
					// 			></span>
					// 			<span
					// 				className="w-6 h-6 rounded-full ml-2"
					// 				style={{ backgroundColor: event.subcolor }}
					// 			></span>
					// 		</div>
					// 		<Button
					// 			onClick={() => navigate(`/events/${event.idEvent}`)}
					// 			className="mt-4 px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900"
					// 		>
					// 			Ver Detalles
					// 		</Button>
					// 	</div>
					// </div>
				))}
			</div>

			<div
				className="bg-white text-amber-900 rounded-lg p-4 border border-dashed border-amber-800 flex flex-col items-center justify-center cursor-pointer"
				onClick={() => setShowForm(!showForm)}
			>
				<h3 className="text-lg font-semibold">Agregar Evento</h3>
				<Plus size={50} />
			</div>

			{showForm && (
				<div className="mt-4 p-4 border rounded-lg shadow-lg">
					<h3 className="text-lg font-semibold mb-2">Nuevo Evento</h3>
					<input
						type="text"
						placeholder="Color principal"
						value={newEvent.color}
						onChange={(e) =>
							setNewEvent({ ...newEvent, color: e.target.value })
						}
						className="w-full p-2 border rounded mb-2"
					/>
					<input
						type="text"
						placeholder="Color secundario"
						value={newEvent.subcolor}
						onChange={(e) =>
							setNewEvent({ ...newEvent, subcolor: e.target.value })
						}
						className="w-full p-2 border rounded mb-2"
					/>
					<input
						type="text"
						placeholder="URL de la imagen"
						value={newEvent.image}
						onChange={(e) =>
							setNewEvent({ ...newEvent, image: e.target.value })
						}
						className="w-full p-2 border rounded mb-2"
					/>
					<div className="flex justify-center mt-2">
						<span
							className="w-6 h-6 rounded-full"
							style={{ backgroundColor: newEvent.color }}
						></span>
						<span
							className="w-6 h-6 rounded-full ml-2"
							style={{ backgroundColor: newEvent.subcolor }}
						></span>
					</div>
					<Button className="w-full">Guardar Evento</Button>
				</div>
			)}
		</div>
	);
}
