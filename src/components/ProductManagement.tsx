
import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: { PP: '', P: '', M: '', G: '', GG: '', XG: '' }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sizes: { PP: '', P: '', M: '', G: '', GG: '', XG: '' }
    });
    setIsEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({
        title: "Erro",
        description: "Nome e preço são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      sizes: {
        PP: parseInt(formData.sizes.PP) || 0,
        P: parseInt(formData.sizes.P) || 0,
        M: parseInt(formData.sizes.M) || 0,
        G: parseInt(formData.sizes.G) || 0,
        GG: parseInt(formData.sizes.GG) || 0,
        XG: parseInt(formData.sizes.XG) || 0,
      }
    };

    if (isEditing) {
      updateProduct(isEditing, productData);
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      });
    } else {
      addProduct(productData);
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso!",
      });
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      sizes: {
        PP: product.sizes.PP.toString(),
        P: product.sizes.P.toString(),
        M: product.sizes.M.toString(),
        G: product.sizes.G.toString(),
        GG: product.sizes.GG.toString(),
        XG: product.sizes.XG.toString(),
      }
    });
    setIsEditing(product.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Atualize as informações do produto' : 'Preencha os dados para adicionar um novo produto'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Camiseta Básica Branca"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do produto..."
                rows={3}
              />
            </div>

            <div>
              <Label>Quantidades por Tamanho</Label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-2">
                {Object.keys(formData.sizes).map((size) => (
                  <div key={size}>
                    <Label htmlFor={size} className="text-sm">{size}</Label>
                    <Input
                      id={size}
                      type="number"
                      min="0"
                      value={formData.sizes[size as keyof typeof formData.sizes]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        sizes: { ...prev.sizes, [size]: e.target.value }
                      }))}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? 'Atualizar Produto' : 'Adicionar Produto'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produtos Cadastrados</CardTitle>
            <CardDescription>
              Gerencie seus produtos existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const totalStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
                return (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{totalStock} unidades</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {Object.entries(product.sizes).map(([size, qty]) => (
                        <div key={size} className="text-center">
                          <div className="text-xs font-medium text-gray-600">{size}</div>
                          <div className="text-sm font-semibold">{qty}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                        className="flex-1"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManagement;
