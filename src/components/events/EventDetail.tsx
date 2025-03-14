import { useParams } from "react-router-dom";

const events = [
  { id: 1, title: "Conferencia Tech 2025", date: "2025-06-10", location: "Madrid, España", description: "Un evento sobre tecnología e innovación." },
  { id: 2, title: "Startup Meetup", date: "2025-07-22", location: "Ciudad de México", description: "Encuentro de startups con inversores." },
  { id: 3, title: "AI Summit", date: "2025-08-15", location: "San Francisco, USA", description: "Foro de inteligencia artificial y aprendizaje automático." },
];

export default function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Evento no encontrado</h2>
        <p>El evento que buscas no existe.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">{event.title}</h2>
      <p className="text-gray-600">{event.date} - {event.location}</p>
      <p className="mt-4">{event.description}</p>
    </div>
  );
}
