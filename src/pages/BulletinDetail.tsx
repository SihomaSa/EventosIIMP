import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBullentins } from "@/services/api";
import { BulletinType } from "@/types/bulletinTypes";
import Header from "@/components/Header";

export default function BulletinDetail() {
	const { id } = useParams<{ id: string }>();
	const [bulletin, setBulletin] = useState<BulletinType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadBulletin = async () => {
			try {
				const data = await fetchBullentins();
				const foundBulletin = data.find((b) => b.idTipPre === id);

				if (!foundBulletin) {
					setError("Boletín no encontrado");
					return;
				}

				setBulletin(foundBulletin);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar el boletín");
			} finally {
				setLoading(false);
			}
		};

		if (id) loadBulletin();
	}, [id]);

	if (loading) return <p>Cargando boletín...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="h-screen bg-orange-50 overflow-hidden">
			<Header />
			<div className="flex flex-col items-center p-6">
				<h1 className="text-3xl font-bold">{bulletin?.titulo}</h1>
				<p className="text-gray-500">{bulletin?.descripcionIdioma}</p>
				<img
					src={bulletin?.foto}
					alt={bulletin?.titulo}
					className="mt-4 w-full max-w-lg"
				/>
			</div>
		</div>
	);
}
