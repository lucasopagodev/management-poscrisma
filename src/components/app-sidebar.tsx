import { Home, UserRoundSearch, BookHeart, Shirt, Baby } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Afilhados",
    url: "/afilhados",
    icon: UserRoundSearch,
  },
  {
    title: "Padrinhos",
    url: "/padrinhos",
    icon: BookHeart,
  },
  {
    title: "Camisetas",
    url: "/camisetas",
    icon: Shirt,
  },
  {
    title: "Busca Camisetas",
    url: "/camisetas/busca",
    icon: Shirt,
  },
  {
    title: "Mascotes",
    url: "/mascotes",
    icon: Baby,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
  );
}
