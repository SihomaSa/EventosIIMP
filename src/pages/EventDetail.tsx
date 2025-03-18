import HomeLayout from "../components/HomeLayout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";
import { EventType } from "../types/eventTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditEventModal from "@/components/events/EventEditModal";

export default function EventDetail() {
	const { id } = useParams();
	const [event, setEvent] = useState<EventType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [editSection, setEditSection] = useState<string | null>(null);

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
			<div className="max-w-4xl overflow-hidden mx-auto p-6 bg-white rounded-lg shadow-lg">
				<div
					className="bg-cover bg-center rounded-lg"
					style={{
						backgroundImage: `url(${event.foto})`,
						backgroundColor: event.color,
					}}
				>
					<h1 className="text-3xl font-bold text-white bg-black/50 p-4 rounded-lg">
						{event.des_event}
					</h1>
				</div>

				<Tabs defaultValue="general">
					<TabsList className="my-4">
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="ads">Publicidades</TabsTrigger>
						<TabsTrigger value="press">Notas de prensa</TabsTrigger>
						<TabsTrigger value="activities">Cronograma</TabsTrigger>
						<TabsTrigger value="bulletins">Boletines</TabsTrigger>
						<TabsTrigger value="sponsors">Auspiciadores</TabsTrigger>
					</TabsList>

					<TabsContent value="general">
						<div className="flex items-center justify-around py-4">
							{/* <img
								src={event.foto}
								alt={event.des_event}
								className="h-60 object-cover rounded"
							/> */}

							<div
								className="w-20 border-3 rounded-lg flex items-center"
                >
								<img
                  src={event.foto}
                  alt={event.des_event}
									className="object-cover p-2 w-auto"
								/>
							</div>
							<div className="flex flex-col mt-2">
								<h2>Colores</h2>
								<div className="flex rounded-full">
									<span
										className="w-6 h-6 rounded-full"
										style={{ backgroundColor: event.color }}
									></span>
									<span
										className="w-6 h-6 rounded-full ml-2"
										style={{ backgroundColor: event.subcolor }}
									></span>
								</div>
							</div>
						</div>
						<Button onClick={() => setEditSection("general")} variant="outline">
							Editar
						</Button>
					</TabsContent>
					<TabsContent value="ads">
						<div className="space-y-4 py-4">
							{event.ads.map((pub, index) => (
								<div
									key={index}
									className="border p-2 rounded flex items-center justify-around"
								>
									<img
										src={pub.image}
										alt="Publicidad"
										className="h-40 object-cover"
									/>
									<a
										href={pub.url}
										className="text-blue-500"
										target="_blank"
										rel="noopener noreferrer"
									>
										{pub.url}
									</a>
								</div>
							))}
							<Button onClick={() => setEditSection("ads")} variant="outline">
								Editar
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="press">
						<div className="space-y-4 py-4">
							{event.pressNotes.map((nota, index) => (
								<div
									key={index}
									className="border p-2 rounded flex items-center justify-around"
								>
									<img
										src={nota.image}
										alt="Nota de prensa"
										className="h-40 object-cover"
									/>
									<div className="flex flex-col items-start">
										<p>
											<strong>{nota.title}</strong> ({nota.date})
										</p>
										<a
											href={nota.url}
											className="text-blue-500"
											target="_blank"
											rel="noopener noreferrer"
										>
											{nota.url}
										</a>
									</div>
								</div>
							))}
							<Button onClick={() => setEditSection("press")} variant="outline">
								Editar
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="activities">
						<div className="space-y-4">
							{event.activities.map((act, index) => (
								<div key={index} className="border p-2 rounded">
									<p>
										<strong>{act.name}</strong> ({act.date})
									</p>
									<p>
										Hora: {act.date} | Instructor: {act.instructor}
									</p>
								</div>
							))}
							<Button
								onClick={() => setEditSection("activities")}
								variant="outline"
							>
								Editar
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="bulletins">
						<div className="space-y-4 py-4">
							{event.bulletins.map((boletin, index) => (
								<div
									key={index}
									className="border p-2 rounded flex justify-around"
								>
									<img
										src={boletin.image}
										alt="Boletín"
										className="h-40 object-cover"
									/>
									<div className="flex flex-col items-start justify-center">
										<h2 className="text-xl font-bold">Boletín N°{index + 1}</h2>
										<p>
											<strong>{boletin.title}</strong> ({boletin.date})
										</p>
										<a
											href={boletin.url}
											className="text-blue-500"
											target="_blank"
											rel="noopener noreferrer"
										>
											{boletin.url}
										</a>
									</div>
								</div>
							))}
							<Button
								onClick={() => setEditSection("bulletins")}
								variant="outline"
							>
								Editar
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="sponsors">
						<div className="space-x-4 flex flex-wrap py-4">
							{event.sponsors.map((sponsor, index) => (
								<div
									key={index}
									className="w-20 border-3 rounded-lg flex items-center"
								>
									<img
										src={sponsor.image}
										alt="Auspiciador"
										className="object-cover p-2 w-auto"
									/>
								</div>
							))}
						</div>
						<Button
							onClick={() => setEditSection("sponsors")}
							variant="outline"
						>
							Editar
						</Button>
					</TabsContent>
				</Tabs>

				{editSection && (
					<EditEventModal
						section={editSection}
						event={event}
						onClose={() => setEditSection(null)}
					/>
				)}
			</div>
		</HomeLayout>
	);
}
