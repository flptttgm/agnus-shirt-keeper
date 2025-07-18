
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  return (
    <header className="bg-gradient-to-r from-brand-dark to-brand-red text-white shadow-lg">
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
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-lg font-semibold">{user?.email}</p>
              <p className="text-sm text-gray-200">Usuário Autenticado</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
