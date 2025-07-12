import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch sales from Supabase
  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedSales: Sale[] = data.map(sale => ({
        id: sale.id,
        productId: sale.product_id,
        productName: sale.product_name,
        size: sale.size as 'P' | 'M' | 'G' | 'GG' | 'XG' | 'XGG',
        quantity: sale.quantity,
        unitPrice: Number(sale.unit_price),
        totalPrice: Number(sale.total_price),
        royaltyPercent: sale.royalty_percent ? Number(sale.royalty_percent) : undefined,
        royaltyAmount: sale.royalty_amount ? Number(sale.royalty_amount) : undefined,
        createdAt: new Date(sale.created_at),
      }));

      setSales(formattedSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar vendas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new sale
  const addSale = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('sales')
        .insert({
          product_id: saleData.productId,
          product_name: saleData.productName,
          size: saleData.size,
          quantity: saleData.quantity,
          unit_price: saleData.unitPrice,
          total_price: saleData.totalPrice,
          royalty_percent: saleData.royaltyPercent,
          royalty_amount: saleData.royaltyAmount,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso",
      });

      fetchSales(); // Refresh the list
    } catch (error) {
      console.error('Error adding sale:', error);
      toast({
        title: "Erro",
        description: "Falha ao registrar venda",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    addSale,
    refreshSales: fetchSales,
  };
};