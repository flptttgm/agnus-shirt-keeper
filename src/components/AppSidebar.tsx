
import { BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react";
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

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: BarChart3,
  },
  {
    id: 'products',
    title: 'Produtos',
    icon: Package,
  },
  {
    id: 'sales',
    title: 'Vendas',
    icon: ShoppingCart,
  },
  {
    id: 'reports',
    title: 'Relatórios',
    icon: TrendingUp,
  },
];

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciamento de Camisetas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
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
