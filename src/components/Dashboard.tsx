import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  BarChart3,
  Shirt,
  Image,
  BadgePercent
} from 'lucide-react';

const Dashboard = () => {
  const { products, sales } = useStore();

  const totalProducts = products.length;
  const totalStock = products.reduce((total, product) => {
    return total + Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
  }, 0);
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((total, sale) => total + sale.totalPrice, 0);
  
  // Cálculo dos royalties acumulados
  const totalRoyalties = sales.reduce((total, sale) => {
    return total + (sale.royaltyAmount || 0);
  }, 0);

  const lowStockProducts = products.filter(product => {
    const totalProductStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
    return totalProductStock < 10 && totalProductStock > 0;
  });

  const outOfStockProducts = products.filter(product => {
    const totalProductStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
    return totalProductStock === 0;
  });

  // Análise de produtos mais vendidos
  const productSales = sales.reduce((acc, sale) => {
    if (!acc[sale.productId]) {
      acc[sale.productId] = {
        name: sale.productName,
        quantity: 0,
        revenue: 0
      };
    }
    acc[sale.productId].quantity += sale.quantity;
    acc[sale.productId].revenue += sale.totalPrice;
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topSellingProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  // Análise de tamanhos mais vendidos
  const sizeSales = sales.reduce((acc, sale) => {
    if (!acc[sale.size]) acc[sale.size] = 0;
    acc[sale.size] += sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const totalSoldItems = Object.values(sizeSales).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Executivo</h1>
        <p className="text-gray-600">Visão geral do seu negócio em tempo real</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Total de Produtos
            </CardTitle>
            <Package className="h-6 w-6 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
            <p className="text-xs text-blue-100 mt-1">produtos cadastrados</p>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <Package className="h-24 w-24" />
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-100">
              Estoque Total
            </CardTitle>
            <BarChart3 className="h-6 w-6 text-green-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStock}</div>
            <p className="text-xs text-green-100 mt-1">unidades em estoque</p>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <BarChart3 className="h-24 w-24" />
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">
              Vendas Realizadas
            </CardTitle>
            <ShoppingCart className="h-6 w-6 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSales}</div>
            <p className="text-xs text-purple-100 mt-1">transações concluídas</p>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <ShoppingCart className="h-24 w-24" />
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">
              Receita Total
            </CardTitle>
            <DollarSign className="h-6 w-6 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-orange-100 mt-1">faturamento acumulado</p>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <DollarSign className="h-24 w-24" />
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">
              Royalties Acumulados
            </CardTitle>
            <BadgePercent className="h-6 w-6 text-indigo-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {totalRoyalties.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-indigo-100 mt-1">valor total em royalties</p>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <BadgePercent className="h-24 w-24" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos Mais Vendidos */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Produtos
            </CardTitle>
            <CardDescription>Os produtos mais vendidos da loja</CardDescription>
          </CardHeader>
          <CardContent>
            {topSellingProducts.length > 0 ? (
              <div className="space-y-4">
                {topSellingProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantity} unidades vendidas</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      R$ {product.revenue.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma venda registrada ainda</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Análise de Tamanhos */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Vendas por Tamanho
            </CardTitle>
            <CardDescription>Distribuição de vendas por tamanho</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(sizeSales).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(sizeSales)
                  .sort(([,a], [,b]) => b - a)
                  .map(([size, quantity]) => {
                    const percentage = totalSoldItems > 0 ? (quantity / totalSoldItems) * 100 : 0;
                    return (
                      <div key={size} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">{size}</span>
                            </div>
                            <span className="font-medium">{quantity} unidades</span>
                          </div>
                          <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma venda por tamanho registrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Nova seção: Produtos e Disponibilidade */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5 text-blue-600" />
            Produtos e Disponibilidade de Tamanhos
          </CardTitle>
          <CardDescription>Visualize todos os produtos e seus estoques por tamanho</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const totalStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
                const maxStock = Math.max(...Object.values(product.sizes));
                
                return (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-all bg-white">
                    {/* Imagem do Produto */}
                    <div className="mb-4 relative">
                      {product.image ? (
                        <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Image className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">Sem imagem</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-green-600 font-bold">R$ {product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={totalStock > 10 ? "default" : totalStock > 0 ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {totalStock} total
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Disponibilidade por Tamanho:</h4>
                      {Object.entries(product.sizes).map(([size, quantity]) => {
                        const percentage = maxStock > 0 ? (quantity / maxStock) * 100 : 0;
                        const stockLevel = quantity === 0 ? 'out' : quantity < 5 ? 'low' : 'good';
                        
                        return (
                          <div key={size} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  stockLevel === 'out' ? 'bg-red-100 text-red-600' :
                                  stockLevel === 'low' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-green-100 text-green-600'
                                }`}>
                                  {size}
                                </div>
                                <span className="text-sm font-medium">{quantity} unidades</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  stockLevel === 'out' ? 'border-red-200 text-red-600 bg-red-50' :
                                  stockLevel === 'low' ? 'border-yellow-200 text-yellow-600 bg-yellow-50' :
                                  'border-green-200 text-green-600 bg-green-50'
                                }`}
                              >
                                {stockLevel === 'out' ? 'Esgotado' : 
                                 stockLevel === 'low' ? 'Baixo' : 'Disponível'}
                              </Badge>
                            </div>
                            <Progress 
                              value={percentage} 
                              className={`h-2 ${
                                stockLevel === 'out' ? '[&>div]:bg-red-500' :
                                stockLevel === 'low' ? '[&>div]:bg-yellow-500' :
                                '[&>div]:bg-green-500'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {product.description && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">{product.description}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Shirt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Nenhum produto cadastrado</h3>
              <p className="text-sm">Cadastre seus produtos para visualizar o estoque aqui</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas de Estoque */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lowStockProducts.length > 0 && (
            <Card className="shadow-lg border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-5 w-5" />
                  Estoque Baixo
                </CardTitle>
                <CardDescription>Produtos que precisam de reposição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.map((product) => {
                    const totalStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
                    return (
                      <div key={product.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="font-medium text-gray-800">{product.name}</span>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                          {totalStock} restantes
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {outOfStockProducts.length > 0 && (
            <Card className="shadow-lg border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Sem Estoque
                </CardTitle>
                <CardDescription>Produtos esgotados que precisam de reposição urgente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {outOfStockProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-gray-800">{product.name}</span>
                      <Badge variant="destructive">
                        Esgotado
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
