import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginRequest } from '../../types/auth';
import { AlertCircle, LogIn } from 'lucide-react';
import './LoginForm.scss';

export const LoginForm: React.FC = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      await login(formData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleChange = (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };


  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>
      </div>


      {submitError && (
        <div className="login-form__error">
          <AlertCircle size={16} />
          {submitError}
        </div>
      )}

      <div className="login-form__field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={handleChange('username')}
          className={errors.username ? 'error' : ''}
          placeholder="Enter your username"
          disabled={loading}
        />
        {errors.username && (
          <div className="login-form__error">
            <AlertCircle size={14} />
            {errors.username}
          </div>
        )}
      </div>

      <div className="login-form__field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          className={errors.password ? 'error' : ''}
          placeholder="Enter your password"
          disabled={loading}
        />
        {errors.password && (
          <div className="login-form__error">
            <AlertCircle size={14} />
            {errors.password}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="login-form__submit"
        loading={loading}
        icon={<LogIn size={20} />}
      >
        Sign In
      </Button>

      <div className="login-form__footer">
        <p>Don't have an account?</p>
        <Link to="/register">Create an account</Link>
      </div>
    </form>
  );
};
