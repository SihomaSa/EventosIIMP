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
// import { NewEventType } from "@/types/createEvent";

const eventSchema = z.object({
	color: z.string().min(1, "El color es obligatorio"),
	subcolor: z.string().optional(),
	foto: z.instanceof(FileList).nullable().optional(),
  });
  
interface NewEventType {
	color: string;
	subcolor?: string;
	foto?: FileList | null;
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
				const response = await fetch("https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/event"); // Reemplaza con tu URL real
				if (!response.ok) throw new Error("Error al obtener eventos");
				
				const data: EventType[] = await response.json();
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

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
			setValue("foto", e.target.files as unknown as FileList);
		}
	};

	const onSubmit = (data: NewEventType) => {
		console.log("Evento agregado:", data);
	};

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
			<h2 className="text-2xl font-bold mb-4">Selecciona el evento que desea ver</h2>

			<div className="flex flex-wrap justify-center items-center gap-2 py-9">
				{events.map((event, index) => {
					if (event.estado === "0") {
						return (
							<div key={index} className="w-20 h-20 border-3 border-stone-400 rounded-lg shadow-xl flex items-center">
								<img src={event.foto} alt="evento logo" className="object-cover p-2 w-full h-auto grayscale" />
							</div>
						);
					}
					return (
						<Link key={index} to={`/home/sponsors`} onClick={() => { selectEvent(event); setTheme(`event${event.idEvent}`); }}>
							<div className="w-20 h-20 border-3 border-primary rounded-lg shadow-xl hover:shadow-2xl flex items-center transition delay-150 duration-300 ease-in-out hover:scale-110">
								<img src={event.foto} alt="evento logo" className="object-cover p-2 w-full h-auto" />
							</div>
						</Link>
					);
				})}
			</div>

			<div className="bg-white text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer" onClick={() => setShowForm(!showForm)}>
				<h3 className="text-lg font-semibold">Agregar Evento</h3>
				<Plus size={50} />
			</div>

			{showForm && (
				<form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-6 border rounded-lg shadow-lg space-y-4">
					<h3 className="text-lg font-semibold">Nuevo Evento</h3>

					<div className="w-full flex items-center justify-between">
						<label className="text-sm font-medium">Color Principal</label>
						<div className="flex items-center gap-2">
							<input type="color" {...register("color")} className="w-20 h-12 rounded-xl" />
							{errors.color && <p className="text-red-500">{errors.color.message}</p>}
						</div>
					</div>

					<div className="w-full flex items-center justify-between">
						<label className="text-sm font-medium">Color Secundario (Opcional)</label>
						<div className="flex items-center gap-2">
							<input type="color" {...register("subcolor")} className="w-20 h-12 rounded-xl" />
						</div>
					</div>

					<div className="w-full flex items-center justify-between">
						<label className="text-sm text-left font-medium py-2">Subir Imagen</label>
						<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-upload" />
						<label htmlFor="file-upload" className="cursor-pointer bg-accent text-accent-foreground px-4 py-2 rounded-md text-center">Seleccionar Archivo</label>
						{errors.foto && <p className="text-red-500">{errors.foto.message}</p>}
					</div>

					{preview && <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded" />}

					<Button type="submit" className="w-full">Guardar Evento</Button>
				</form>
			)}
		</div>
	);
}