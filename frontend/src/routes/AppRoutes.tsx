import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {TasksPage} from "../pages/TasksPage.tsx";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/tasks" element={<TasksPage />} />
    </Routes>
  );
};
