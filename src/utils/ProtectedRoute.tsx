// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../Contexts/authContext";

// export default function ProtectedRoute() {
//   const { user } = useAuth();
//   return user ? <Outlet /> : <Navigate to="/" />;
// }
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/Contexts/authContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
