import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { products, sales } = useStore();

  // Análises de vendas
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((total, sale) => total + sale.totalPrice, 0);
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Produtos mais vendidos
  const productSales = sales.reduce((acc, sale) => {
    const key = sale.productId;
    if (!acc[key]) {
      acc[key] = {
        productName: sale.productName,
        quantity: 0,
        revenue: 0,
      };
    }
    acc[key].quantity += sale.quantity;
    acc[key].revenue += sale.totalPrice;
    return acc;
  }, {} as Record<string, { productName: string; quantity: number; revenue: number }>);

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Análise por tamanho
  const sizeSales = sales.reduce((acc, sale) => {
    if (!acc[sale.size]) {
      acc[sale.size] = { quantity: 0, revenue: 0 };
    }
    acc[sale.size].quantity += sale.quantity;
    acc[sale.size].revenue += sale.totalPrice;
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number }>);

  // Vendas por período (últimos 7 dias) - formatado para o gráfico
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailySales = last7Days.map(date => {
    const daysSales = sales.filter(sale => 
      new Date(sale.createdAt).toISOString().split('T')[0] === date
    );
    return {
      date,
      displayDate: new Date(date).toLocaleDateString('pt-BR', { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit' 
      }),
      quantity: daysSales.reduce((sum, sale) => sum + sale.quantity, 0),
      revenue: daysSales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    };
  });

  // Vendas ordenadas por data (da mais recente para a mais antiga)
  const salesByDate = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const chartConfig = {
    revenue: {
      label: "Receita",
      color: "#22c55e",
    },
    quantity: {
      label: "Quantidade",
      color: "#3b82f6",
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">vendas realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">faturamento total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">por venda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos Mais Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top 5 produtos por quantidade</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-gray-600">{product.quantity} unidades vendidas</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">R$ {product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma venda registrada ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Vendas por Tamanho */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Tamanho</CardTitle>
            <CardDescription>Distribuição de vendas por tamanho</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(sizeSales).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(sizeSales)
                  .sort(([,a], [,b]) => b.quantity - a.quantity)
                  .map(([size, data]) => (
                    <div key={size} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{size}</span>
                        </div>
                        <div>
                          <p className="font-medium">{data.quantity} unidades</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">R$ {data.revenue.toFixed(2)}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma venda registrada ainda</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Vendas dos Últimos 7 Dias */}
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Vendas dos Últimos 7 Dias</CardTitle>
          <CardDescription>Evolução visual das vendas e receita</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="quantity" 
                  fill="var(--color-quantity)"
                  name="Quantidade"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="revenue" 
                  fill="var(--color-revenue)"
                  name="Receita (R$)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Vendas dos Últimos 7 Dias - Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
          <CardDescription>Dados detalhados da evolução diária</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Data</th>
                  <th className="text-left py-2">Quantidade</th>
                  <th className="text-left py-2">Receita</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((day, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">{day.displayDate}</td>
                    <td className="py-2 font-medium">{day.quantity} unidades</td>
                    <td className="py-2 font-semibold text-green-600">R$ {day.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lista Completa de Vendas por Data */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Completo de Vendas</CardTitle>
          <CardDescription>Todas as vendas ordenadas da mais recente para a mais antiga</CardDescription>
        </CardHeader>
        <CardContent>
          {salesByDate.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Hora</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Royalty %</TableHead>
                  <TableHead>Valor Royalty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByDate.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{sale.productName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {sale.size}
                      </span>
                    </TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>R$ {sale.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      R$ {sale.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                        {sale.royaltyPercent || 0}%
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-purple-600">
                      R$ {(sale.royaltyAmount || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma venda registrada ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
