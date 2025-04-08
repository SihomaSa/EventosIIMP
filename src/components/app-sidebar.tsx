import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Megaphone, Newspaper, Users, Handshake, CalendarDays, Settings } from "lucide-react";
import NavItem from "@/components/NavItem"; // Importa el componente corregido

const items = [
  { label: "Publicidad", to: "/home/ads", icon: <Megaphone strokeWidth={3} /> },
  { label: "Nota de Prensa", to: "/home/press", icon: <Megaphone strokeWidth={3} /> },
  { label: "Boletines", to: "/home/bulletins", icon: <Newspaper strokeWidth={3} /> },
  { label: "Conferencistas", to: "/home/expositors", icon: <Users strokeWidth={3} /> },
  { label: "Auspiciadores", to: "/home/sponsors", icon: <Handshake strokeWidth={3} /> },
  { label: "Actividades", to: "/home/activities", icon: <CalendarDays strokeWidth={3} /> },
  { label: "Programas", to: "/home/programs", icon: <CalendarDays strokeWidth={3} /> },
  { label: "Configuración", to: "/home/settings", icon: <Settings strokeWidth={3} /> },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md py-8">Administrador</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <NavItem icon={item.icon} label={item.label} to={item.to} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
