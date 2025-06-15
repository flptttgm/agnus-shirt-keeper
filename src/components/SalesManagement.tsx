
import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { SizeType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const SalesManagement = () => {
  const { products, sales, addSale } = useStore();
  const { toast } = useToast();
  const [saleData, setSaleData] = useState({
    productId: '',
    size: '' as SizeType,
    quantity: '',
    unitPrice: '',
  });

  const selectedProduct = products.find(p => p.id === saleData.productId);
  const availableStock = selectedProduct ? selectedProduct.sizes[saleData.size as SizeType] || 0 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!saleData.productId || !saleData.size || !saleData.quantity || !saleData.unitPrice) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(saleData.quantity);
    const unitPrice = parseFloat(saleData.unitPrice);

    if (quantity > availableStock) {
      toast({
        title: "Erro",
        description: `Estoque insuficiente. Disponível: ${availableStock} unidades`,
        variant: "destructive",
      });
      return;
    }

    if (unitPrice <= 0) {
      toast({
        title: "Erro",
        description: "O preço unitário deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const sale = {
      productId: saleData.productId,
      productName: selectedProduct!.name,
      size: saleData.size,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
    };

    addSale(sale);
    
    const originalPrice = selectedProduct!.price;
    const isCustomPrice = unitPrice !== originalPrice;
    
    toast({
      title: "Sucesso",
      description: isCustomPrice 
        ? `Venda registrada com preço personalizado! (Preço original: R$ ${originalPrice.toFixed(2)})`
        : "Venda registrada com sucesso!",
    });

    setSaleData({
      productId: '',
      size: '' as SizeType,
      quantity: '',
      unitPrice: '',
    });
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSaleData(prev => ({
      ...prev,
      productId,
      unitPrice: product ? product.price.toString() : '',
      size: '' as SizeType,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Venda</CardTitle>
          <CardDescription>
            Selecione o produto, tamanho e registre a venda. Você pode alterar o preço se necessário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product">Produto</Label>
                <Select value={saleData.productId} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - R$ {product.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size">Tamanho</Label>
                <Select 
                  value={saleData.size} 
                  onValueChange={(value) => setSaleData(prev => ({ ...prev, size: value as SizeType }))}
                  disabled={!selectedProduct}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct && Object.entries(selectedProduct.sizes).map(([size, stock]) => (
                      <SelectItem key={size} value={size} disabled={stock === 0}>
                        {size} - {stock} disponível(is)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={availableStock}
                  value={saleData.quantity}
                  onChange={(e) => setSaleData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Qtd"
                />
                {selectedProduct && saleData.size && (
                  <p className="text-sm text-gray-500 mt-1">
                    Disponível: {availableStock} unidades
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={saleData.unitPrice}
                  onChange={(e) => setSaleData(prev => ({ ...prev, unitPrice: e.target.value }))}
                  placeholder="0.00"
                />
                {selectedProduct && saleData.unitPrice && parseFloat(saleData.unitPrice) !== selectedProduct.price && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Preço diferente do cadastrado (R$ {selectedProduct.price.toFixed(2)})
                  </p>
                )}
              </div>

              <div>
                <Label>Total da Venda</Label>
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <span className="text-lg font-bold text-green-700">
                    R$ {(parseInt(saleData.quantity || '0') * parseFloat(saleData.unitPrice || '0')).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!selectedProduct}
            >
              Registrar Venda
            </Button>
          </form>
        </CardContent>
      </Card>

      {sales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>
              Últimas vendas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Data</th>
                    <th className="text-left py-2">Produto</th>
                    <th className="text-left py-2">Tamanho</th>
                    <th className="text-left py-2">Qtd</th>
                    <th className="text-left py-2">Preço Unit.</th>
                    <th className="text-left py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(-10).reverse().map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 text-sm">
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2 font-medium">{sale.productName}</td>
                      <td className="py-2">{sale.size}</td>
                      <td className="py-2">{sale.quantity}</td>
                      <td className="py-2">R$ {sale.unitPrice.toFixed(2)}</td>
                      <td className="py-2 font-semibold text-green-600">
                        R$ {sale.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesManagement;
