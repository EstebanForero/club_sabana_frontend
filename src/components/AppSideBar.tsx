import { Link, useNavigate } from "@tanstack/react-router";
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Button } from "./ui/button";
import { AuthManager } from "@/backend/auth";
import { URol } from "@/backend/common";

export interface SidebarLink {
  icon: React.ComponentType;
  text: string;
  to: string;
}

interface AppSidebarProps {
  links: SidebarLink[];
}

export function AppSidebar({ links }: AppSidebarProps) {

  const navigate = useNavigate();

  const userRol = AuthManager.getUserRol() ?? URol.USER

  let components;

  if (userRol === URol.USER) {
    components = <div></div>;
  } else if (userRol === URol.TRAINER) {
    components = (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard_user">User Dashboard</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard_trainer">Trainer Dashboard</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  } else {
    components = (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard_user">User Dashboard</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard_trainer">Trainer Dashboard</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to="/dashboard_admin">Admin Dashboard</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link to={link.to}>
                      <link.icon />
                      <span>{link.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {components}
        <Button variant={'destructive'} onClick={() => {
          AuthManager.logout()
          navigate({ to: '/' })
        }}>Log Out</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
