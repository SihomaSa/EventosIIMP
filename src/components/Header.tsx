import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/Contexts/authContext";

export default function Header() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	return (
		<header className="bg-white shadow-md flex items-center justify-between p-4">
			<Button onClick={() => navigate(-1)}>← Volver</Button>
			<h1 className="text-xl font-semibold"> </h1>
			<Button
				className="p-2"
				variant={"secondary"}
				onClick={() => {
					logout();
					navigate("/");
				}}
			>
				Cerrar Sesión
			</Button>
		</header>
	);
}
