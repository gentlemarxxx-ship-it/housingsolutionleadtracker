import { Users, UserCheck, UserX, HelpCircle, FolderKanban, LogOut } from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@/contexts/UserContext"
import { Button } from "./ui/button"

const items = [
  { title: "Leads", url: "/", icon: FolderKanban },
  { title: "Approved", url: "/approved", icon: UserCheck },
  { title: "Decline", url: "/decline", icon: UserX },
  { title: "No Answer", url: "/no-answer", icon: HelpCircle },
]

export function AppSidebar() {
  const { currentUser, logout } = useUser()

  return (
    <Sidebar className="border-r border-sidebar-border flex flex-col">
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold mb-4">
            Lead Pipeline
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="text-sm font-medium mb-2">
          Logged in as: <span className="font-bold">{currentUser}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Switch User
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}