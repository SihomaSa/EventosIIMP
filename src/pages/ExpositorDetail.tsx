import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExpositorById } from "@/services/api";
import { ExpositorType } from "@/types/expositorTypes";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";

export default function ExpositorDetail() {
	const { id } = useParams<{ id: string }>();
	const [expositor, setExpositor] = useState<ExpositorType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) {
			setError("ID de conferencista no válido");
			setLoading(false);
			return;
		}

		const loadExpositor = async () => {
			try {
				const data = await fetchExpositorById(id);
				setExpositor(data);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar el conferencista");
			} finally {
				setLoading(false);
			}
		};

		loadExpositor();
	}, [id]);

	if (loading)
		return (
			<div className="flex flex-col items-center justify-center">
				<img
					src="/img/LOGOS_iimp 7.svg"
					alt="Logo de la empresa"
					className="max-w-md text-white py-2"
				/>
				<Loader2 className="animate-spin" />
			</div>
		);
	if (error) return <p className="text-red-500">{error}</p>;
	if (!expositor) return <p>No se encontró el conferencista</p>;

	return (
		<div className="h-screen bg-orange-50">
			<Header />

			<div className=" w-full flex items-center justify-center">
				<Card className="text-center mt-6 max-w-2/3 p-6 w-full ">
					<div className="flex items-center justify-around">
						<Avatar className="size-20 md:size-40 border-2 border-orange-300">
							<AvatarImage src={expositor.image} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>

						<div className="p-2 text-center flex flex-col">
							<h2 className="text-3xl font-bold">{expositor.name}</h2>
							<q className="text-xs md:text-2xl md:leading-3">
								"{expositor.phrase}"
							</q>
							{/* <blockquote className="text-xs md:text-2xl md:leading-3">
								{expositor.phrase}
							</blockquote> */}
						</div>
					</div>
					<Card className="bg-orange-50 p-5 shadow-none border-0">
						<h3 className="font-bold text-left text-xl">Hoja de Vida</h3>
						<p className="text-justify text-xs md:text-sm lg:text-lg">{expositor.cv}</p>
					</Card>
				</Card>
			</div>
		</div>
	);
}
