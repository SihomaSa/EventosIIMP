import { useState } from "react";
import { useAuth } from "../Contexts/authContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
	username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function Login() {
	// const [username, setUsername] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

	// const handleLogin = () => {
	// 	if (username.trim()) {
	// 		login(username);
	// 		navigate("/home"); // Redirect to a protected page
	// 	}
	// };
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [errors, setErrors] = useState<{
		username?: string;
		password?: string;
	}>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const result = schema.safeParse(formData);
		if (!result.success) {
			const formattedErrors = result.error.flatten().fieldErrors;
			setErrors({
				username: formattedErrors.username?.[0],
				password: formattedErrors.password?.[0],
			});
			return;
		}


			login(formData.username);
			navigate("/home"); // Redirect to a protected page

	};

	return (
		<div className="h-screen w-screen bg-[#BDADAD] flex justify-center items-center">
			<div className="bg-white rounded-lg p-10">
				<form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
          <h1 className="text-gray-600 pb-3">Administrador</h1>
					<input
            className="border border-gray-400 rounded-xl p-3"
						type="text"
						placeholder="Usuario"
						value={formData.username}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
					/>
					{errors.username && <p>{errors.username}</p>}

					<input
          className="border border-gray-400 rounded-xl p-3"
						type="password"
						placeholder="Contraseña"
						value={formData.password}
						onChange={(e) =>
							setFormData({ ...formData, password: e.target.value })
						}
					/>
					{errors.password && <p>{errors.password}</p>}

					<button className="bg-[#C09054] text-white" type="submit">Iniciar sesión</button>
				</form>
				{/* <button className="" onClick={handleLogin}>Login</button> */}
			</div>
		</div>
	);
}
