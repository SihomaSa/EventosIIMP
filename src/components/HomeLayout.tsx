import { useAuth } from "../Contexts/authContext";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar";
import { useTheme } from "@/Contexts/themeContext";

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { resetTheme } = useTheme();

  return (
    <div className="flex">
      <SidebarProvider>
      <AppSidebar />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col bg-secondary">
        {/* Navbar */}
        <header className="bg-white shadow-md flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold"> </h1>
          <Button className="p-2" variant={"secondary"} onClick={() => { logout(); navigate("/login"); resetTheme()}}>Cerrar Sesión</Button>
        </header>

        {/* Contenido dinámico */}
        <main className="p-6">
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
    </div>

  );
}
