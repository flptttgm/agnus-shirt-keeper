import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        image: product.image,
        sizes: {
          P: product.size_p,
          M: product.size_m,
          G: product.size_g,
          GG: product.size_gg,
          XG: product.size_xg,
          XGG: product.size_xgg,
        },
        createdAt: new Date(product.created_at),
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new product
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          size_p: productData.sizes.P,
          size_m: productData.sizes.M,
          size_g: productData.sizes.G,
          size_gg: productData.sizes.GG,
          size_xg: productData.sizes.XG,
          size_xgg: productData.sizes.XGG,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso",
      });

      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar produto",
        variant: "destructive",
      });
    }
  };

  // Update product
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updateData: any = {};
      
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.image !== undefined) updateData.image = productData.image;
      
      if (productData.sizes) {
        updateData.size_p = productData.sizes.P;
        updateData.size_m = productData.sizes.M;
        updateData.size_g = productData.sizes.G;
        updateData.size_gg = productData.sizes.GG;
        updateData.size_xg = productData.sizes.XG;
        updateData.size_xgg = productData.sizes.XGG;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });

      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar produto",
        variant: "destructive",
      });
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso",
      });

      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover produto",
        variant: "destructive",
      });
    }
  };

  // Update product stock
  const updateProductStock = async (productId: string, size: keyof Product['sizes'], quantity: number) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const sizeColumn = `size_${size.toLowerCase()}`;
      const newQuantity = Math.max(0, product.sizes[size] + quantity);

      const { error } = await supabase
        .from('products')
        .update({ [sizeColumn]: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar estoque",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    refreshProducts: fetchProducts,
  };
};