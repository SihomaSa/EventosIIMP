import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { getSponsors } from "@/stores/eventDataStore";
import { SponsorType } from "../types/sponsorTypes";
import { useEventStore } from "@/stores/eventStore";
import { fetchSponsors } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function Sponsors() {
	const { selectedEvent } = useEventStore();
	const [sponsors, setSponsors] = useState<SponsorType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadSponsors = async () => {
			try {
				const data = await fetchSponsors();
				setSponsors(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar las notas de prensa");
			} finally {
				setLoading(false);
			}
		};

		loadSponsors();
	}, [selectedEvent, sponsors]);

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="flex-1 p-6">
			<h1 className="text-2xl font-bold mb-4">Gestión de Auspiciadores</h1>
			<Button className="mb-4">Agregar Sponsor</Button>
			<div className="space-x-4 flex flex-col py-4 justify-center items-center">
				{loading && <Loader2 className="animate-spin" />}
				{sponsors.map((sponsor) => (
					// <div key={sponsor.id} className="w-20 h-20 bg-white border-3 rounded-lg flex items-center cursor-pointer hover:shadow-xl">
					//   <img src={sponsor.image} alt={sponsor.title} className="object-cover p-2 w-auto" />
					// </div>
					<div key={sponsor.id} className="w-full grid grid-cols-[auto_auto] gap-4 items-center justify-center py-2 border-0">
						<div
							
							className="w-20 h-20 border rounded-xl overflow-hidden cursor-pointer flex items-center justify-center p-2"
						>
							<img
								src={sponsor.image}
								alt={`sponsor ${sponsor.id}`}
								className="object-cover w-full h-auto"
							/>
						</div>
						<a
							href={sponsor.url}
							className="border-2 border-amber-900 p-2 rounded-lg whitespace-nowrap w-80 overflow-scroll"
							target="_blank"
							rel="noopener noreferrer"
						>
							{sponsor.url}
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
