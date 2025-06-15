
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
              <img 
                src="/lovable-uploads/2350fbd4-1615-4a7d-911f-53dc992630cf.png" 
                alt="Badboy Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Badboy</h1>
              <p className="text-blue-100">Sistema de Gestão de Estoque</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Gestão Inteligente</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
