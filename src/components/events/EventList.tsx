import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { EventType } from "@/types/eventTypes";
import { useTheme } from "@/Contexts/themeContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchEvents, createEvent } from '../services/eventService';

const eventSchema = z.object({
  color: z.string().min(1, "El color es obligatorio"),
  subcolor: z.string().optional(),
  foto: z.instanceof(FileList).nullable().optional(),
  des_event: z.string().min(1, "La descripción es obligatoria"),
});

interface NewEventType {
  color: string;
  subcolor?: string;
  foto?: FileList | null;
  des_event: string;
}

export default function EventList() {
  const { selectEvent } = useEventStore();
  const { setTheme, applyEventColors } = useTheme();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { handleSubmit, setValue, register } = useForm<NewEventType>({ 
    resolver: zodResolver(eventSchema) 
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data.sort((a, b) => a.idEvent - b.idEvent));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar eventos");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("foto", e.target.files as unknown as FileList);
    }
  };

  const handleSelectEvent = (event: EventType) => {
    selectEvent(event);
    applyEventColors(event.color, event.subcolor);
    setTheme(`event${event.idEvent}`, event.color, event.subcolor);
    navigate('/home/ads');
  };

  const onSubmit = async (data: NewEventType) => {
    try {
      const formData = new FormData();
      formData.append("color", data.color);
      if (data.subcolor) formData.append("subcolor", data.subcolor);
      formData.append("des_event", data.des_event);
      if (data.foto?.[0]) formData.append("foto", data.foto[0]);

      await createEvent(formData);
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);
      setShowForm(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al crear evento");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center">
        <img
          src="/img/LOGOS_iimp 7.svg"
          alt="Logo de la empresa"
          className="max-w-md text-white py-2"
        />
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="h-screen w-screen py-9 px-9 max-w-md m-auto overflow-y-scroll overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-4">
        Selecciona el evento que desea ver
      </h2>
      <div className="grid grid-cols-4 gap-4 py-9">
        {events.map((event, index) => (
          <div key={event.idEvent} 
          className="flex items-center justify-center">

            {index < 2 ? (
              <button
                onClick={() => handleSelectEvent(event)}
                className="w-full h-full flex items-center justify-center focus:outline-none"
                style={{
                  // backgroundColor: event.subcolor,
                  // borderColor: event.color
                }}
              >
                <div 
                  className={`
                    w-20 h-20 border-3 rounded-lg shadow-xl
                    flex items-center justify-center
                    ${index < 2 
                      ? "border-primary cursor-pointer hover:shadow-2xl transition-all" 
                      : "border-gray-300 opacity-60 grayscale pointer-events-none"}
                  `}>
                  <img
                    src={event.foto || "/img/event-placeholder.png"}
                    alt={event.des_event}
                    className="object-contain w-16 h-16 p-2"
                    loading="lazy"
                  />
                </div>
              </button>
            ) : (
              <div 
                className="w-20 h-20 border-3 rounded-lg shadow-xl flex items-center justify-center opacity-60 grayscale"
                style={{
                  // backgroundColor: event.subcolor,
                  // borderColor: event.color
                }}
              >
                <img
                  src={event.foto || "/img/event-placeholder.png"}
                  alt={event.des_event}
                  className="object-contain w-16 h-16 p-2"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {!showForm && (
        <div 
          className="bg-white text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer"
          // onClick={() => setShowForm(true)}
          style={{ color: "var(--color-stone-400)", borderColor: "var(--color-stone-400)" }}
				
        >
          
          <h3 className="text-lg font-semibold">Agregar Nuevo Evento</h3>
          <Plus size={50} />
        </div>
      )}

      {showForm && (
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="mt-4 p-6 border rounded-lg shadow-lg space-y-4 bg-white"
        >
          <h3 className="text-lg font-semibold">Nuevo Evento</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Nombre del Evento</label>
            <input
              type="text"
              {...register("des_event")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Ingrese el nombre del evento"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Color Principal</label>
              <input
                type="color"
                {...register("color")}
                className="w-20 h-12 rounded-xl cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Color Secundario</label>
              <input
                type="color"
                {...register("subcolor")}
                className="w-20 h-12 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Imagen del Evento</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary-dark"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Guardar Evento
            </button>
          </div>
        </form>
      )}
    </div>
  );
}