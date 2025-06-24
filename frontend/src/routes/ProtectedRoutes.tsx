import React from 'react';

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  // For now, we'll just return the children
  return <>{children}</>;
};
