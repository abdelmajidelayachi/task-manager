import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoutes } from './ProtectedRoutes';
import { TasksPage } from '../pages/TasksPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

export const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/tasks" replace /> : <LoginPage />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/tasks" replace /> : <RegisterPage />}
            />

            {/* Protected routes */}
            <Route path="/tasks" element={
                <ProtectedRoutes>
                    <TasksPage />
                </ProtectedRoutes>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />

            {/* Catch all - redirect to tasks */}
            <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
    );
};
