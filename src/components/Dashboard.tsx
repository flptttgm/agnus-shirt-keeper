
import React from 'react';
import { useStore } from '@/context/StoreContext';

const Dashboard = () => {
  const { products, sales } = useStore();

  const totalProducts = products.length;
  const totalStock = products.reduce((total, product) => {
    return total + Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
  }, 0);
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((total, sale) => total + sale.totalPrice, 0);

  const lowStockProducts = products.filter(product => {
    const totalProductStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
    return totalProductStock < 10;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Produtos</p>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
            <div className="text-4xl">👕</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Estoque Total</p>
              <p className="text-3xl font-bold">{totalStock}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total de Vendas</p>
              <p className="text-3xl font-bold">{totalSales}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Receita Total</p>
              <p className="text-3xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Produtos com Estoque Baixo</h3>
          <div className="space-y-2">
            {lowStockProducts.map((product) => {
              const totalStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
              return (
                <div key={product.id} className="flex justify-between items-center py-2 px-4 bg-white rounded-lg">
                  <span className="font-medium text-gray-800">{product.name}</span>
                  <span className="text-red-600 font-semibold">{totalStock} unidades</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Produtos Cadastrados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">M</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">G</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">XG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const totalStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.sizes.PP}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.sizes.P}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.sizes.M}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.sizes.G}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.sizes.GG}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.sizes.XG}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{totalStock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
