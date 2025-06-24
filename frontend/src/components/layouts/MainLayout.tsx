import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button/Button';
import { LogOut, User } from 'lucide-react';
import './MainLayout.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <div className="container">
          <div className="main-layout__header-content">
            <h1 className="main-layout__title">Task Manager</h1>
            {user && (
              <div className="main-layout__user-section">
                <div className="main-layout__user-info">
                  <User size={16} />
                  <span>Welcome, {user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main-layout__content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};
