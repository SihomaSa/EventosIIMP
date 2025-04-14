import { useState } from "react";
import { Link, Globe,  Edit } from "lucide-react";
// import { Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { deleteAd } from "../services/adsService";
import DeleteAlert from "../DeleteAlert";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface AdCardProps {
	id: number;
	foto: string;
	url: string;
	idioma: string;
	openUpdateModal: () => void;
	onDelete: () => void;
}

export default function AdCard({
	id,
	foto,
	url,
	idioma,
	openUpdateModal,
	onDelete,
}: AdCardProps) {

	const [error, setError] = useState<string | null>(null);
	
	const deleteSelectedAd = async (id: string) => {
		try {
			await deleteAd(id);
			onDelete(); 
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			setError("Error al borrar ");
			console.error(error)
		}
	};
	return (
		<>
			<Card className="border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col p-0 gap-0">
				<CardHeader className="p-0">
				<div className="relative w-full h-44">
					<img
							src={foto}
							alt={`publicidad ${id}`}
							className="object-cover h-auto max-h-full rounded-md"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 rounded-t-lg"></div>
					<div className="absolute bottom-0 left-0 p-3 w-full">
						<div className="flex items-center justify-between">
							<span className="px-2 py-1 bg-primary text-white text-xs rounded-md">
								{idioma}
							</span>
						</div>
           			 </div>
				</div>
				</CardHeader>
				<CardContent className="p-3 bg-white flex-grow">
					<div className="flex flex-col w-full gap-2">
						{/* URL */}
					
							<div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
								<Label 
									htmlFor="url"
									className="text-xs font-medium flex items-center gap-1 text-primary truncate"
								  >
								 <Link size={14} className="text-primary flex-shrink-0" />
								 <span className="truncate">URL</span>
								</Label>
								<div className="flex items-center">
									<Input 
										id="url"
										value={url} 
										disabled 
										className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
                  					/>
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className="ml-2 text-primary hover:text-primary/80 transition-colors"
									>
										<Link size={14} />
									</a>
                				</div>
							</div>
 						
						{/* Language */}
						<div className="w-full group bg-gray-50 p-2 rounded-md border border-gray-200 hover:border-primary/30 transition-colors duration-200">
							<Label 
								htmlFor="idioma"
								className="text-xs font-medium flex items-center gap-1 text-primary truncate"
							  >
								<Globe size={14} className="text-primary flex-shrink-0" />
								<span className="truncate">Idioma</span>
							</Label>
								<Input
								 id="idioma"
								 value={idioma}
								 disabled
								 className="bg-transparent border-0 text-sm p-0 h-6 focus:ring-0 shadow-none truncate"
							   />
						</div>
						
				</div>
				</CardContent>
				<CardFooter className="px-3 py-2! bg-gray-50 border-t border-gray-100 flex justify-between">
						<DeleteAlert 
						id={String(id)} 
						name="la publicidad" 
						deleteMethod={() => deleteSelectedAd(String(id))} 
						/>
					<Button
						size="sm"
						className="cursor-pointer bg-primary hover:bg-primary/90 text-white flex items-center gap-1 transition-colors duration-200"
						onClick={(event) => {
							event.preventDefault(); // Previene la recarga de la página
							openUpdateModal();
						}}
          			>
						<Edit size={14} />
						<span className="truncate">Editar</span>
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}
