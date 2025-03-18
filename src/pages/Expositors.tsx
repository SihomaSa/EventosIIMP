import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchExpositors } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpositorType } from "@/types/expositorTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Expositors() {
	const [expositors, setExpositors] = useState<ExpositorType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const loadExpositors = async () => {
			try {
				const data = await fetchExpositors();
				setExpositors(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar los conferencistas");
			} finally {
				setLoading(false);
			}
		};

		loadExpositors();
	}, []);

	if (loading) return <p>Cargando conferencistas...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="flex-1 p-6">
			<h1 className="text-2xl font-bold mb-4">Gestión de Conferencistas</h1>
			<Button className="mb-4">Agregar Conferencistas</Button>
			<div className="flex flex-wrap gap-4 justify-center mx-5">
				{expositors.map((expo, index) => (
					<Card
						key={index}
						className="shadow-md overflow-hidden cursor-pointer p-3"
						onClick={() => navigate(`/expositors/${expo.id}`)}
					>
						<CardContent className="flex items-center justify-around">
							<Avatar className="size-20">
								<AvatarImage src={expo.image} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>

							<div className="p-2 text-center flex flex-col">
								<h2 className="text-lg text-left font-bold">{expo.name}</h2>
								<blockquote className="text-lg leading-3">{expo.phrase}</blockquote>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
