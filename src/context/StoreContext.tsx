
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Sale } from '@/types';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  updateProductStock: (productId: string, size: keyof Product['sizes'], quantity: number) => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSales(prev => [...prev, newSale]);
    
    // Atualizar estoque
    updateProductStock(saleData.productId, saleData.size, -saleData.quantity);
  };

  const updateProductStock = (productId: string, size: keyof Product['sizes'], quantity: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          sizes: {
            ...product.sizes,
            [size]: Math.max(0, product.sizes[size] + quantity)
          }
        };
      }
      return product;
    }));
  };

  return (
    <StoreContext.Provider value={{
      products,
      sales,
      addProduct,
      updateProduct,
      deleteProduct,
      addSale,
      updateProductStock,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
