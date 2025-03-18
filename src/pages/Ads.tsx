import { useEffect, useState } from "react";
import { AdType } from "../types/adTypes";
import { fetchAds } from "@/services/api";
import { Button } from "@/components/ui/button";

export default function Ads() {
	const [ads, setAds] = useState<AdType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadAds = async () => {
			try {
				const data = await fetchAds();
				setAds(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar las publicidades");
			} finally {
				setLoading(false);
			}
		};

		loadAds();
	}, []);

	if (loading) return <p>Cargando publicidades...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="flex-1 p-6">
			<h1 className="text-2xl font-bold mb-4">Gestión de Publicidades</h1>
			<Button className="mb-4">Agregar Publicidad</Button>
			<div className="space-x-4 flex flex-col py-4 justify-center items-center">
				{ads.map((ad) => (
					<div className=" flex justify-center items-center py-2 m-0">
						<div
							key={ad.id}
							className="h-full border rounded-xl overflow-hidden cursor-pointer flex items-center justify-around mr-4"
							onClick={() =>
								window.open(ad.url, "_blank", "noopener,noreferrer")
							}
						>
							<img
								src={ad.image}
								alt={`Ad ${ad.id}`}
								className="object-cover w-full h-auto"
							/>
						</div>
						<a
							href={ad.url}
							className="border-2 border-amber-900 p-2 rounded-lg"
							target="_blank"
							rel="noopener noreferrer"
						>
							{ad.url}
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
