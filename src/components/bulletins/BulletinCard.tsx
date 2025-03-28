import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { deleteBulletin } from "../services/bulletinsService";
import DeleteAlert from "../DeleteAlert";

interface BulletinCardProps {
	id: number;
	foto: string;
	titulo: string;
	descripcion: string;
	idioma: string;
	openUpdateModal: () => void;
	onDelete: () => void;
}

export default function BulletinCard({
	id,
	foto,
	titulo,
	descripcion,
	idioma,
	openUpdateModal,
	onDelete
}: BulletinCardProps) {

	const [error, setError] = useState<string | null>(null);

	const deleteSelectedBulletin = async (id: string) => {
		  try {
			  await deleteBulletin(id);
			  onDelete(); 
		  // eslint-disable-next-line @typescript-eslint/no-unused-vars
		  } catch (err) {
			  setError("Error al borrar ");
			  console.error(error)
		  }
	  };
	return (
		<Card className="shadow-md overflow-hidden p-4 w-80 hover:shadow-2xl transition delay-150 duration-300 ease-in-out hover:scale-110">
		<CardContent>
		  <img
			src={foto}
			alt={titulo}
			className="object-cover w-full h-40 rounded-md"
		  />
		  <form className="p-2 space-y-2">
			<div>
			  <Label htmlFor="titulo">Título</Label>
			  <Input id="titulo" value={titulo} disabled className="bg-gray-100" />
			</div>
			<div>
			  <Label htmlFor="descripcion">Descripción</Label>
			  <Input id="descripcion" value={descripcion} disabled className="bg-gray-100" />
			</div>
			<div>
			  <Label htmlFor="idioma">Idioma</Label>
			  <Input id="idioma" value={idioma} disabled className="bg-gray-100" />
			</div>
			<div className="flex justify-between">
            			<DeleteAlert id={String(id)} name="el boletín" deleteMethod={() => deleteSelectedBulletin(String(id))} />

						<Button
							onClick={(event) => {
								event.preventDefault();
								openUpdateModal();
							}}
						>
							<Pencil />
							Editar
						</Button>
					</div>
		  </form>
		</CardContent>
	  </Card>
	);
}
