import React, { createContext, useContext, ReactNode } from 'react';
import { Product, Sale } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  updateSale: (saleId: string, sale: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>;
  deleteSale: (saleId: string) => Promise<void>;
  updateProductStock: (productId: string, size: keyof Product['sizes'], quantity: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshSales: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const {
    products,
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    refreshProducts,
  } = useProducts();

  const {
    sales,
    loading: salesLoading,
    addSale: addSaleToDb,
    updateSale: updateSaleInDb,
    deleteSale: deleteSaleFromDb,
    refreshSales,
  } = useSales();

  const addSale = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    // Add the sale to database
    await addSaleToDb(saleData);
    
    // Update product stock
    await updateProductStock(saleData.productId, saleData.size, -saleData.quantity);
    
    // Refresh data
    await refreshProducts();
    await refreshSales();
  };

  const updateSale = async (saleId: string, saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    // Update the sale in database
    await updateSaleInDb(saleId, saleData);
    
    // Refresh data
    await refreshProducts();
    await refreshSales();
  };

  const deleteSale = async (saleId: string) => {
    // Delete the sale from database (this also handles stock restoration)
    await deleteSaleFromDb(saleId);
    
    // Refresh data
    await refreshProducts();
    await refreshSales();
  };

  const loading = productsLoading || salesLoading;

  return (
    <StoreContext.Provider value={{
      products,
      sales,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      addSale,
      updateSale,
      deleteSale,
      updateProductStock,
      refreshProducts,
      refreshSales,
    }}>
      {children}
    </StoreContext.Provider>
  );
};