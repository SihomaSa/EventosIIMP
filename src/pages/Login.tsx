import { useState } from "react";
import { useAuth } from "../Contexts/authContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      });
      return;
    }

    setLoading(true);
    setErrors({}); // Limpiar errores previos

    try {
      await login(formData.email, formData.password); // Inicia sesión con Firebase
      navigate("/events"); // Redirige después del login
    } catch (error) {
      setErrors({ general: "Credenciales incorrectas. Inténtalo de nuevo." });
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-[#C09054]">
      {/* Sección del logo (oculta en móvil) */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <img
          src="/img/LOGOS_iimp 1 (3).svg"
          alt="Logo de la empresa"
          className="w-2/3 max-w-md text-white"
        />
      </div>

      {/* Sección del formulario */}
      <div className="h-screen md:h-auto w-full md:w-1/2 flex flex-col justify-center items-center p-6 bg-slate-100 rounded-l-2xl shadow-xl">
        <img
          src="/img/LOGOS_iimp 7.svg"
          alt="Logo de la empresa"
          className="md:hidden max-w-md text-white h-15 py-2"
        />
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-gray-700 text-2xl font-semibold text-center mb-4">
            Administrador
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <input
              className="border border-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C09054]"
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <input
              className="border border-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C09054]"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

            <Button className="bg-[#C09054] hover:bg-[#a6763c] text-white p-3 rounded-lg">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Cargando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}