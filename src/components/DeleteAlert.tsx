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
	className?: string;
  	size?: "sm" | "lg" | "default";
}

export default function DeleteAlert({
	id,
	name,
	deleteMethod,
	className, 
}: DeleteAlertProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button 
				variant={"outline"}
				size={"sm"}
      			className={`cursor-pointer text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-1 transition-colors duration-200 ${className}`}
				>
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
