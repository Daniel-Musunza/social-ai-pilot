import { UserNav } from "@/components/layout/UserNav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Aperture } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Aperture className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              SocioPilot Lite
            </span>
          </Link>
        </div>

        {/* Mobile sidebar trigger */}
        <div className="md:hidden">
           <SidebarTrigger />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
