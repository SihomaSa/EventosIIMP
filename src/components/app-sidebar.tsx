import { Calendar, CalendarDays, Handshake, Home, Inbox, Megaphone, Newspaper, Search, Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/home",
    icon: Home,
  },
  {
    title: "Publicidad",
    url: "/home/ads",
    icon: Megaphone,
  },
  {
    title: "Actividades",
    url: "/home/sponsors",
    icon: Handshake,
  },
  {
    title: "Programas",
    url: "#",
    icon: CalendarDays,
  },
  {
    title: "Nota de Prensa",
    url: "/home/press",
    icon: Megaphone,
  },
  {
    title: "Boletines",
    url: "/home/bulletins",
    icon: Newspaper,
  },
  {
    title: "Conferencistas",
    url: "/home/expositors",
    icon: Users,
  },
  {
    title: "Auspiciadores",
    url: "/home/sponsors",
    icon: Handshake,
  },
  {
    title: "Configuración",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md py-8">Administrador</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-bold">
                      <item.icon strokeWidth={3} />
                      <span className="text-2xl pl-2">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
