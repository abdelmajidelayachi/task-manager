import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import './LoginPage.scss';

export const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__logo">
          <h1>Task Manager</h1>
          <p>Organize your work, achieve your goals</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
