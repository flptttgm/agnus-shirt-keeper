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
        customerName: sale.customer_name || undefined,
        customerPhone: sale.customer_phone || undefined,
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
          customer_name: saleData.customerName,
          customer_phone: saleData.customerPhone,
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

  // Update existing sale
  const updateSale = async (saleId: string, saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({
          product_id: saleData.productId,
          product_name: saleData.productName,
          size: saleData.size,
          quantity: saleData.quantity,
          unit_price: saleData.unitPrice,
          total_price: saleData.totalPrice,
          royalty_percent: saleData.royaltyPercent,
          royalty_amount: saleData.royaltyAmount,
          customer_name: saleData.customerName,
          customer_phone: saleData.customerPhone,
        })
        .eq('id', saleId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Venda atualizada com sucesso",
      });

      fetchSales(); // Refresh the list
    } catch (error) {
      console.error('Error updating sale:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar venda",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Delete sale and restore stock
  const deleteSale = async (saleId: string) => {
    try {
      // First get the sale data to restore stock
      const { data: saleData, error: fetchError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the sale
      const { error: deleteError } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (deleteError) throw deleteError;

      // Restore stock by adding back the sold quantity
      const sizeColumn = `size_${saleData.size.toLowerCase()}`;
      
      // Get current product data
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(sizeColumn as any)
        .eq('id', saleData.product_id)
        .single();

      if (productError) throw productError;

      const currentStock = productData[sizeColumn];
      const { error: updateError } = await supabase
        .from('products')
        .update({ [sizeColumn]: currentStock + saleData.quantity })
        .eq('id', saleData.product_id);

      if (updateError) throw updateError;

      toast({
        title: "Sucesso",
        description: "Venda excluída e estoque restaurado com sucesso",
      });

      fetchSales(); // Refresh the list
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir venda",
        variant: "destructive",
      });
    }
  };

  return {
    sales,
    loading,
    addSale,
    updateSale,
    deleteSale,
    refreshSales: fetchSales,
  };
};