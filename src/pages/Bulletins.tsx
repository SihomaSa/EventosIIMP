import { useEffect, useState } from "react";
import { BulletinType } from "../types/bulletinTypes";
import { fetchBullentins } from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Bulletins() {
	const [bulletins, setBulletins] = useState<BulletinType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadBulletins = async () => {
			try {
				const data = await fetchBullentins();
				setBulletins(data);
			} catch (err) {
				setError("Error al cargar los boletines");
			} finally {
				setLoading(false);
			}
		};

		loadBulletins();
	}, []);

	if (loading) return <p>Cargando boletines...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
        <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Boletines</h1>
        <Button className="mb-4">Agregar Boletín</Button>
		<div className="flex flex-wrap gap-4 justify-center">
			{bulletins.map((bulletin, index) => (
                <Card
                    key={bulletin.id}
                    className="shadow-md overflow-hidden cursor-pointer p-2"
					onClick={() =>
						window.open(bulletin.url, "_blank", "noopener,noreferrer")
					}
				>
                    <CardContent>
                        <img
                            src={bulletin.image}
                            alt={bulletin.title}
                            className="object-cover w-full h-auto rounded"
                        />
                        <div className="p-2 text-center">
                            <h2 className="text-xl font-bold">Boletín N°{index + 1}</h2>
                        </div>
                    </CardContent>
				</Card>
			))}
		</div>
        </div>
	);
}
