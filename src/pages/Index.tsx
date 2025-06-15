
import React, { useState } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ProductManagement from '@/components/ProductManagement';
import SalesManagement from '@/components/SalesManagement';
import Reports from '@/components/Reports';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'sales':
        return <SalesManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <StoreProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex items-center px-4 py-3 border-b bg-white">
              <SidebarTrigger />
              <h1 className="ml-4 text-lg font-semibold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'products' && 'Produtos'}
                {activeTab === 'sales' && 'Vendas'}
                {activeTab === 'reports' && 'Relatórios'}
              </h1>
            </div>
            <main className="flex-1 container mx-auto max-w-7xl">
              {renderContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </StoreProvider>
  );
};

export default Index;
