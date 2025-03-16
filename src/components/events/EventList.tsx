import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import EventDetailModal from "./EventDetailModal";
import { useState } from "react";

interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
  }

  const initialEvents: Event[] = [
    { id: 1, title: "Conferencia Tech 2025", date: "2025-06-10", location: "Madrid, España", description: "Un evento sobre tecnología e innovación." },
    { id: 2, title: "Startup Meetup", date: "2025-07-22", location: "Ciudad de México", description: "Encuentro de startups con inversores." },
    { id: 3, title: "AI Summit", date: "2025-08-15", location: "San Francisco, USA", description: "Foro de inteligencia artificial y aprendizaje automático." },
  ];

export default function EventList() {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleUpdate = (updatedEvent: Event) => {
        setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
      };
    
	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Eventos</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{events.map((event) => (
					<div
						key={event.id}
						className="bg-white shadow-md rounded-lg p-4 border border-amber-800"
					>
						<h3 className="text-lg font-semibold">{event.title}</h3>
						<p className="text-gray-600">{event.date}</p>
						<p className="text-gray-500">{event.location}</p>
						{/* <Link to={`/events/${event.id}`}> */}
							<button className="mt-3 px-4 py-2 bg-[#C09054] text-white rounded-md hover:bg-amber-800 transition" onClick={() => setSelectedEvent(event)}>
								Ver Detalles
							</button>
						{/* </Link> */}
					</div>
				))}
				<Link to={`/newEvent`}>
					<div key={0} className="bg-white text-amber-900 rounded-lg p-4 border border-dashed border-amber-800 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold">Agregar Evento</h3>
                        <Plus size={50} />
					</div>
				</Link>
			</div>
            {selectedEvent && (
                <EventDetailModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onUpdate={handleUpdate}
                />
            )}
		</div>
	);
}
