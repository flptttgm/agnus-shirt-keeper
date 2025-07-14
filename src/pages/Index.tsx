
import React, { useState } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
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
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="container mx-auto max-w-7xl">
          {renderContent()}
        </main>
      </div>
    </StoreProvider>
  );
};

export default Index;
