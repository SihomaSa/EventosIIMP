import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteAlertProps {
	id: string;
	name: string;
	deleteMethod: (id: string) => void;
}

export default function DeleteAlert({
	id,
	name,
	deleteMethod,
}: DeleteAlertProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"outline"}>
					<Trash2 /> Eliminar
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
                    ¿ En verdad desea eliminar {name} ?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción será permanente. Una vez eliminado no se podrá
						recuperar.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteMethod(id);
						}}
					>
						Continuar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
