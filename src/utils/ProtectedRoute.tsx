// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../Contexts/authContext";

// export default function ProtectedRoute() {
//   const { user } = useAuth();
//   return user ? <Outlet /> : <Navigate to="/" />;
// }
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/Contexts/authContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  return <Outlet />;

  if (loading) {
    return <div>Cargando...</div>; // Puedes personalizarlo con un spinner o pantalla de carga
  }

  return user ? <Outlet /> : <Navigate to="/" />;
}
