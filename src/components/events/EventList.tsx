import { Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEventStore } from "@/stores/eventStore";
import { EventType } from "@/types/eventTypes";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/Contexts/themeContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const { setTheme } = useTheme();

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<NewEventType>({ resolver: zodResolver(eventSchema) });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_EVENTS_GET);
        if (!response.ok) throw new Error("Error al obtener eventos");
        const data: EventType[] = await response.json();
        setEvents(data.sort((a, b) => a.idEvent - b.idEvent)); // Ordenar por idEvent
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Error al cargar los eventos");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("foto", e.target.files as unknown as FileList);
    }
  };

  const onSubmit = async (data: NewEventType) => {
    try {
      const formData = new FormData();
      formData.append("color", data.color);
      formData.append("subcolor", data.subcolor || "");
      formData.append("des_event", data.des_event);
      if (data.foto?.[0]) {
        formData.append("foto", data.foto[0]);
      }

      const response = await fetch(import.meta.env.VITE_EVENTS_POST, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al crear evento");

      // Recargar la lista de eventos
      const updatedEvents = await fetch(import.meta.env.VITE_EVENTS_GET).then(res => res.json());
      setEvents(updatedEvents);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al crear el evento");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
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
            <div
              key={event.idEvent}
              className="flex items-center justify-center"
            >
              {index < 2 ? (
                <Link
                  to="/home/ads"
                  onClick={() => {
                    selectEvent(event);
                    setTheme(`event${event.idEvent}`);
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className={`
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
                    />
                  </div>
                </Link>
              ) : (
                <div className="w-20 h-20 border-3 border-gray-300 rounded-lg shadow-xl flex items-center justify-center opacity-60 grayscale">
                  <img
                    src={event.foto || "/img/event-placeholder.png"}
                    alt={event.des_event}
                    className="object-contain w-16 h-16 p-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

      <div className="bg-white text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer"
			    //  onClick={() => setShowForm(!showForm)}
				style={{ color: "var(--color-stone-400)", borderColor: "var(--color-stone-400)" }}
				>
        <Plus size={50} className="text-gray-400 mb-2" />
        <h3 className="text-lg font-semibold">Agregar Nuevo Evento</h3>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-6 border rounded-lg shadow-lg space-y-4">
          <h3 className="text-lg font-semibold">Nuevo Evento</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Nombre del Evento</label>
            <input
              type="text"
              {...register("des_event")}
              className="w-full p-2 border rounded"
              placeholder="Ingrese el nombre del evento"
            />
            {errors.des_event && (
              <p className="text-red-500 text-sm">{errors.des_event.message}</p>
            )}
          </div>

          <div className="w-full flex items-center justify-between">
              <label className="text-sm font-medium">Color Principal</label>
              <div className="flex items-center gap-2">
              <input
                type="color"
                {...register("color")}
                className="w-20 h-12 rounded-xl"
              />
              {errors.color && (
                <p className="text-red-500 text-sm">{errors.color.message}</p>
              )}
            </div>

            <div className="w-full flex items-center justify-between">
              <label className="text-sm font-medium">Color Secundario</label>
              <input
                type="color"
                {...register("subcolor")}
                className="w-20 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <label className="text-sm text-left font-medium py-2">Subir Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-accent text-accent-foreground px-4 py-2 rounded-md text-center"
            >
              Seleccionar Archivo
            </label>
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-2 w-full h-32 object-contain rounded border"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Evento</Button>
          </div>
        </form>
      )}
    </div>
  );
}