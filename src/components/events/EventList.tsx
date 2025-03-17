import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
// import EventDetailModal from "./EventDetailModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useEvents } from "../../stores/useEvents";
import { fetchEvents } from "../../services/api";
import { EventType } from "../../types/eventTypes";
import { Button } from "../ui/button";

// interface Event {
// 	idEvent: string;
// 	des_event: string;
// 	foto: string;
// 	estado: string;
// 	subcolor: string;
// 	color: string;
// }

// const initialEvents: Event[] = [
// 	{
// 		foto: "https://iimp-images.s3.us-east-1.amazonaws.com/proexplo/publicidad/publicidad.png",
// 		idEvent: 1,
// 		estado: "1",
// 		subcolor: "#ebdbc6",
// 		color: "#c39254",
// 		des_event: "PROEXPLO",
// 	},
// 	{
// 		foto: "https://iimp-images.s3.us-east-1.amazonaws.com/proexplo/publicidad/publicidad.png",
// 		idEvent: 2,
// 		estado: "1",
// 		subcolor: "#87CEEC",
// 		color: "#87CEEB",
// 		des_event: "PERMIN",
// 	},
// 	{
// 		foto: "https://iimp-images.s3.us-east-1.amazonaws.com/proexplo/publicidad/publicidad.png",
// 		idEvent: 3,
// 		estado: "1",
// 		subcolor: "#0000F1",
// 		color: "#0000FF",
// 		des_event: "Jueves Minero",
// 	},
// 	{
// 		foto: "https://iimp-images.s3.us-east-1.amazonaws.com/proexplo/publicidad/publicidad.png",
// 		idEvent: 4,
// 		estado: "1",
// 		subcolor: "#0000F1",
// 		color: "#0000FF",
// 		des_event: "INSTITUTO DE IDM",
// 	},
// 	{
// 		foto: "https://iimp-images.s3.us-east-1.amazonaws.com/proexplo/publicidad/publicidad.png",
// 		idEvent: 5,
// 		estado: "1",
// 		subcolor: "#0000F1",
// 		color: "#0000FF",
// 		des_event: "PEPITO",
// 	},
// ];

export default function EventList() {
	// const { events, loading, error } = useEvents();
	// const [eventsIn, setEventsIn] = useState<Event[]>(initialEvents);
	// const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
	const navigate = useNavigate();

	// if (loading) return <p>Cargando eventos...</p>;
	// if (error) return <p>Error: {error}</p>;
	const [events, setEvents] = useState<EventType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// const handleUpdate = (updatedEvent: Event) => {
	// 	setEventsIn(
	// 		eventsIn.map((event) =>
	// 			event.idEvent === updatedEvent.idEvent ? updatedEvent : event
	// 		)
	// 	);
	// };

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

	if (loading) return <p>Cargando eventos...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Eventos</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{events.map((event) => (
					<div
						key={event.idEvent}
						className="bg-white shadow-md rounded-xl border border-amber-800 overflow-hidden w-full max-w-md"
					>
						<div
							className="relative overflow-hidden"
							style={{ maxHeight: "200px" }}
						>
							<img
								src={"/img/Banner (1).png"}
								// src={"https://placehold.co/600x400"}
								alt="Imagen de prueba"
								className="w-full object-cover opacity-80"
							/>
							<div className="absolute inset-0 bg-black/30" />
						</div>
						<div className="p-4 text-center">
							<h3 className="text-lg font-semibold">{event.des_event}</h3>
							<div className="flex justify-center mt-2">
								<span
									className="w-6 h-6 rounded-full"
									style={{ backgroundColor: event.color }}
								></span>
								<span
									className="w-6 h-6 rounded-full ml-2"
									style={{ backgroundColor: event.subcolor }}
								></span>
							</div>
							<Button 
								onClick={() => navigate(`/events/${event.idEvent}`)}
								className="mt-4 px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900"
							>
								Ver Detalles
								</Button>
							{/* <p
								className="mt-3 text-amber-800 cursor-pointer hover:underline"
								onClick={() => setSelectedEvent(event)}
							>
								Ver más...
							</p> */}
						</div>
					</div>
				))}

				<Link to={`/newEvent`}>
					<div
						key={0}
						className="bg-white text-amber-900 rounded-lg p-4 border border-dashed border-amber-800 flex flex-col items-center justify-center"
					>
						<h3 className="text-lg font-semibold">Agregar Evento</h3>
						<Plus size={50} />
					</div>
				</Link>
			</div>
			{/* {selectedEvent && (
				<EventDetailModal
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
					onUpdate={handleUpdate}
				/>
			)} */}
		</div>
	);
}
