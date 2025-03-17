import { useAuth } from "../Contexts/authContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, Calendar, Settings, Home as HomeIcon } from "lucide-react";
import { useState } from "react";
import NavItem from "./NavItem";
import { Button } from "./ui/button";

export default function Home({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  // <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>

  return (
    <div className="flex h-screen max-h-screen">
      {/* Sidebar */}
      <div className={`bg-amber-900 text-white w-64 p-5 space-y-4 transition-all ${isOpen ? "translate-x-0" : "-translate-x-64"} sm:translate-x-0 fixed sm:relative h-full`}>
        <h2 className="text-lg font-bold h-[10vh]">Administrador</h2>
        <nav className="space-y-2">
          <NavItem icon={<HomeIcon />} label="Inicio" ref="/home" />
          <NavItem icon={<Calendar size={20} />} label="Eventos" ref="/events" />
          {/* <NavItem icon={<Megaphone size={20} />} label="Publicidad" ref="#" />
          <NavItem icon={<Megaphone size={20} />} label="Boletines" ref="#" />
          <NavItem icon={<Megaphone size={20} />} label="Nota de Prensa" ref="#" />
          <NavItem icon={<Megaphone size={20} />} label="Auspiciadores" ref="#" /> */}
          <NavItem icon={<Settings size={20} />} label="Configuración" ref="#" />
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-md flex items-center justify-between p-4 h-[10vh]">
          <button className="sm:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold"> </h1>
          <Button className="p-2" variant={"secondary"} onClick={() => { logout(); navigate("/login"); }}>Cerrar Sesión</Button>
        </header>

        {/* Contenido dinámico aquí */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
