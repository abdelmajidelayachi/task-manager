import React from 'react';
import './MainLayout.scss'

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
      <div className="main-layout">
        <header className="main-layout__header">
          <div className="container">
            <h1 className="main-layout__title">Task Manager</h1>
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
