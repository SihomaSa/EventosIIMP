import { useAuth } from "../Contexts/authContext";
import { useNavigate, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useTheme } from "@/Contexts/themeContext";
import { Toaster } from "@/components/ui/sonner";
import { LogOut, Menu } from "lucide-react";

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { resetTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/"); //login
    resetTheme();
  };

  return (
    <div className="flex bg-secondary">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="bg-gray-50 border-b border-gray-200 flex items-center justify-between py-2 px-4 md:px-6 h-fit shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Menu size={20} />
                </Button>
              </SidebarTrigger>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-2"
                onClick={handleLogout}
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <LogOut size={18} />
              </Button>
            </div>
          </header>

          <main className="p-3 md:p-6 bg-secondary">
            <div className="mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        <Toaster
          position="top-right"
          closeButton
          richColors
          expand={true}
          duration={4000}
          className="toast-container"
          toastOptions={{
            className: "toast-item"
          }}
        />
      </SidebarProvider>
    </div>
  );
}
