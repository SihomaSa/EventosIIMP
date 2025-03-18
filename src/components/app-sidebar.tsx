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
    title: "Auspiciadores",
    url: "/home/sponsors",
    icon: Handshake,
  },
  {
    title: "Publicidad",
    url: "/home/ads",
    icon: Megaphone,
  },
  {
    title: "Programas",
    url: "#",
    icon: CalendarDays,
  },
  {
    title: "Boletines",
    url: "/home/bulletins",
    icon: Newspaper,
  },
  {
    title: "Nota de Prensa",
    url: "/home/press",
    icon: Megaphone,
  },
  {
    title: "Conferencistas",
    url: "/home/expositors",
    icon: Users,
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
          <SidebarGroupLabel>Administrador</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
