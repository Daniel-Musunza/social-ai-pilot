"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Aperture, LayoutDashboard, Sparkles, CalendarDays, Settings, PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { UserNav } from "./UserNav"; // For mobile view user info
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate Content", icon: Sparkles },
  { href: "/history", label: "History", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings }, // Placeholder for settings
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, open, isMobile } = useSidebar();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Aperture className="h-8 w-8 text-primary" />
            <span className="font-semibold text-xl group-data-[collapsible=icon]:hidden">SocioPilot</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="group-data-[collapsible=icon]:hidden">
            {open ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                  aria-label={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        {isMobile ? ( // Show UserNav and Logout in footer for mobile if sidebar is open
            <>
              <div className="group-data-[collapsible=icon]:hidden mb-2">
                <UserNav />
              </div>
               <Button variant="ghost" onClick={signOut} className="w-full justify-start group-data-[collapsible=icon]:justify-center">
                <LogOut className="h-5 w-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
              </Button>
            </>
        ) : (
          <div className="group-data-[collapsible=icon]:hidden">
            {/* Desktop footer content if any, UserNav is in header */}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
