import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import './RegisterPage.scss';

export const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      <div className="register-page__container">
        <div className="register-page__logo">
          <h1>Task Manager</h1>
          <p>Organize your work, achieve your goals</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};
