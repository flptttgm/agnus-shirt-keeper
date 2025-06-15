
import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { SizeType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Percent, BadgePercent } from 'lucide-react';

const SalesManagement = () => {
  const { products, sales, addSale } = useStore();
  const { toast } = useToast();
  const [saleData, setSaleData] = useState({
    productId: '',
    size: '' as SizeType,
    quantity: '',
    unitPrice: '',
    discountPercent: '',
    royaltyPercent: '0',
  });

  const selectedProduct = products.find(p => p.id === saleData.productId);
  const availableStock = selectedProduct ? selectedProduct.sizes[saleData.size as SizeType] || 0 : 0;
  
  // Cálculo do preço com desconto
  const originalPrice = selectedProduct?.price || 0;
  const discountPercent = parseFloat(saleData.discountPercent || '0');
  const discountAmount = originalPrice * (discountPercent / 100);
  const finalPrice = originalPrice - discountAmount;

  // Cálculo dos royalties
  const royaltyPercent = parseFloat(saleData.royaltyPercent || '0');
  const quantity = parseInt(saleData.quantity || '0');
  const unitPrice = parseFloat(saleData.unitPrice || '0');
  const totalSaleValue = quantity * unitPrice;
  const royaltyAmount = totalSaleValue * (royaltyPercent / 100);

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

    if (discountPercent < 0 || discountPercent > 100) {
      toast({
        title: "Erro",
        description: "O desconto deve estar entre 0% e 100%",
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
      royaltyPercent: royaltyPercent > 0 ? royaltyPercent : undefined,
      royaltyAmount: royaltyAmount > 0 ? royaltyAmount : undefined,
    };

    addSale(sale);
    
    const originalPrice = selectedProduct!.price;
    const hasDiscount = discountPercent > 0;
    const hasRoyalty = royaltyPercent > 0;
    const isCustomPrice = unitPrice !== originalPrice && unitPrice !== finalPrice;
    
    let successMessage = "Venda registrada com sucesso!";
    if (hasDiscount && hasRoyalty) {
      successMessage = `Venda registrada com ${discountPercent}% de desconto e ${royaltyPercent}% de royalties! (Royalties: R$ ${royaltyAmount.toFixed(2)})`;
    } else if (hasDiscount) {
      successMessage = `Venda registrada com ${discountPercent}% de desconto! (Preço original: R$ ${originalPrice.toFixed(2)})`;
    } else if (hasRoyalty) {
      successMessage = `Venda registrada com ${royaltyPercent}% de royalties! (Royalties: R$ ${royaltyAmount.toFixed(2)})`;
    } else if (isCustomPrice) {
      successMessage = `Venda registrada com preço personalizado! (Preço original: R$ ${originalPrice.toFixed(2)})`;
    }
    
    toast({
      title: "Sucesso",
      description: successMessage,
    });

    setSaleData({
      productId: '',
      size: '' as SizeType,
      quantity: '',
      unitPrice: '',
      discountPercent: '',
      royaltyPercent: '0',
    });
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSaleData(prev => ({
      ...prev,
      productId,
      unitPrice: product ? product.price.toString() : '',
      size: '' as SizeType,
      discountPercent: '',
    }));
  };

  const handleDiscountChange = (discount: string) => {
    setSaleData(prev => ({
      ...prev,
      discountPercent: discount,
      unitPrice: selectedProduct && discount ? finalPrice.toFixed(2) : (selectedProduct?.price.toString() || ''),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Venda</CardTitle>
          <CardDescription>
            Selecione o produto, tamanho, aplique descontos e configure royalties para registrar a venda.
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Label htmlFor="discount">Desconto (%)</Label>
                <div className="relative">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={saleData.discountPercent}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    placeholder="0"
                    disabled={!selectedProduct}
                  />
                  <Percent className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {selectedProduct && discountPercent > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Economia: R$ {discountAmount.toFixed(2)}
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
                {selectedProduct && saleData.unitPrice && parseFloat(saleData.unitPrice) !== selectedProduct.price && parseFloat(saleData.unitPrice) !== finalPrice && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Preço personalizado (Original: R$ {selectedProduct.price.toFixed(2)})
                  </p>
                )}
                {selectedProduct && discountPercent > 0 && parseFloat(saleData.unitPrice) === finalPrice && (
                  <p className="text-sm text-blue-600 mt-1">
                    💰 Com desconto aplicado
                  </p>
                )}
              </div>

              <div>
                <Label>Total da Venda</Label>
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <span className="text-lg font-bold text-green-700">
                    R$ {(parseInt(saleData.quantity || '0') * parseFloat(saleData.unitPrice || '0')).toFixed(2)}
                  </span>
                  {discountPercent > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Sem desconto: R$ {(parseInt(saleData.quantity || '0') * originalPrice).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seção de Royalties */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <BadgePercent className="h-5 w-5 text-purple-600" />
                <Label className="text-base font-semibold">Configuração de Royalties</Label>
              </div>
              <RadioGroup
                value={saleData.royaltyPercent}
                onValueChange={(value) => setSaleData(prev => ({ ...prev, royaltyPercent: value }))}
                className="flex flex-row gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="no-royalty" />
                  <Label htmlFor="no-royalty">Sem royalties</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10" id="royalty-10" />
                  <Label htmlFor="royalty-10">10% de royalties</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20" id="royalty-20" />
                  <Label htmlFor="royalty-20">20% de royalties</Label>
                </div>
              </RadioGroup>
              
              {royaltyPercent > 0 && saleData.quantity && saleData.unitPrice && (
                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">
                      Royalties ({royaltyPercent}%):
                    </span>
                    <span className="font-semibold text-purple-700">
                      R$ {royaltyAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    Calculado sobre o valor total da venda
                  </div>
                </div>
              )}
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
                    <th className="text-left py-2">Royalties</th>
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
                      <td className="py-2">
                        {sale.royaltyAmount ? (
                          <div className="text-purple-600">
                            <div className="font-semibold">R$ {sale.royaltyAmount.toFixed(2)}</div>
                            <div className="text-xs">({sale.royaltyPercent}%)</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
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
