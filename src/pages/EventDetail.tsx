import HomeLayout from "../components/HomeLayout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import { EventType } from "../types/eventTypes";


export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const events = await fetchEvents();
        const foundEvent = events.find((e) => e.idEvent === id);
        if (!foundEvent) throw new Error("Evento no encontrado");
        setEvent(foundEvent);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Error al cargar el evento");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) return <p>Cargando evento...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!event) return <p>Evento no encontrado</p>;

  return (
    <HomeLayout>

    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Encabezado con imagen de fondo */}
      <div
        className="h-40 bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${event.foto})`, backgroundColor: event.color }}
      >
        <h1 className="text-3xl font-bold text-white bg-black/50 p-4">{event.des_event}</h1>
      </div>
      
      {/* Sección de Publicidades */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Publicidades</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {event.ads.map((pub, index) => (
            <a key={index} href={pub.url} target="_blank" rel="noopener noreferrer">
              <img src={pub.image} alt="Publicidad" className="w-full h-32 object-cover rounded-lg shadow-md" />
            </a>
          ))}
        </div>
      </section>

      {/* Sección de Notas de Prensa */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Notas de Prensa</h2>
        <div className="space-y-4 mt-2">
          {event.pressNotes.map((note, index) => (
            <a key={index} href={note.url} className="block border p-3 rounded-lg shadow-md hover:bg-gray-100">
              <div className="flex items-center space-x-4">
                <img src={note.image} alt={note.title} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <p className="text-gray-500 text-sm">{note.date}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Sección de Actividades */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Cronograma de Actividades</h2>
        <ul className="mt-2 border rounded-lg p-3 shadow-md">
          {event.activities.map((act, index) => (
            <li key={index} className="border-b py-2 last:border-0">
              <p><strong>{act.date}</strong> - {act.name} ({act.time})</p>
              <p className="text-gray-500 text-sm">Instructor: {act.instructor}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Sección de Boletines */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Boletines</h2>
        <div className="space-y-4 mt-2">
          {event.bulletins.map((bol, index) => (
            <a key={index} href={bol.url} className="block border p-3 rounded-lg shadow-md hover:bg-gray-100">
              <h3 className="text-lg font-semibold">{bol.title}</h3>
              <p className="text-gray-500 text-sm">{bol.date}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Sección de Auspiciadores */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Auspiciadores</h2>
        <div className="space-y-4 mt-2">
          {event.sponsors.map((spon, index) => (
            <a key={index} href={spon.url} className="block border p-3 rounded-lg shadow-md hover:bg-gray-100">
              <div className="flex items-center space-x-4">
                <img src={spon.image} alt={spon.title} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <h3 className="text-lg font-semibold">{spon.title}</h3>
                  <p className="text-gray-500 text-sm">{spon.date}</p>
                  <p className="text-xs text-gray-600">Categorías: {spon.categories.join(", ")}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
    </HomeLayout>

  );
}