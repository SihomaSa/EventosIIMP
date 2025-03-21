import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchEvents } from "@/services/api";
import { EventType } from "@/types/eventTypes";
import { NewEventType } from "@/types/createEvent";
import { Button } from "../ui/button";

export default function EventList() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEventType>({
    color: "",
    subcolor: "",
    foto: ""
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

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen w-screen py-9 px-9 max-w-md m-auto overflow-y-scroll overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-4">Selecciona el evento que administrar</h2>

      <div className="flex justify-center items-center gap-x-2 py-9">
        {events.map((event, index) => (
          <Link to={`/events/${event.idEvent}`} key={index}>
            <div className="w-20 h-20 border-3 rounded-lg shadow-lg flex items-center">
              <img src={event.foto} alt="evento logo" className="object-cover p-2 w-full h-auto" />
            </div>
          </Link>
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
            onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Color secundario"
            value={newEvent.subcolor}
            onChange={(e) => setNewEvent({ ...newEvent, subcolor: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="URL de la imagen"
            value={newEvent.foto}
            onChange={(e) => setNewEvent({ ...newEvent, foto: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <Button className="w-full">Guardar Evento</Button>
        </div>
      )}
    </div>
  );
}
