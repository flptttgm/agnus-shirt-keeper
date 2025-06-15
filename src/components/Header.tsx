
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-black to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12">
              <img 
                src="/lovable-uploads/6b49d302-7ef9-4560-af22-061bdaf8c88d.png" 
                alt="Badboy Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Badboy</h1>
              <p className="text-gray-200">Sistema de Gestão de Estoque</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-200">Gestão Inteligente</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
