import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { RegisterRequest } from '../../types/auth';
import { AlertCircle, UserPlus } from 'lucide-react';
import './RegisterForm.scss';

interface FormErrors extends Partial<RegisterRequest> {
  confirmPassword?: string;
}

export const RegisterForm: React.FC = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form__header">
        <h2>Create Account</h2>
        <p>Sign up to get started with your task manager</p>
      </div>

      {submitError && (
        <div className="register-form__error">
          <AlertCircle size={16} />
          {submitError}
        </div>
      )}

      <div className="register-form__field">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          className={errors.name ? 'error' : ''}
          placeholder="Enter your full name"
          disabled={loading}
        />
        {errors.name && (
          <div className="register-form__error">
            <AlertCircle size={14} />
            {errors.name}
          </div>
        )}
      </div>

      <div className="register-form__field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={handleChange('username')}
          className={errors.username ? 'error' : ''}
          placeholder="Choose a username"
          disabled={loading}
        />
        {errors.username && (
          <div className="register-form__error">
            <AlertCircle size={14} />
            {errors.username}
          </div>
        )}
      </div>

      <div className="register-form__field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          className={errors.password ? 'error' : ''}
          placeholder="Create a password"
          disabled={loading}
        />
        {formData.password && (
          <div className="register-form__password-strength">
            <div className="register-form__password-strength__bar">
              <div className={`register-form__password-strength__fill register-form__password-strength__fill--${passwordStrength}`} />
            </div>
            <div className={`register-form__password-strength__text register-form__password-strength__text--${passwordStrength}`}>
              Password strength: {passwordStrength}
            </div>
          </div>
        )}
        {errors.password && (
          <div className="register-form__error">
            <AlertCircle size={14} />
            {errors.password}
          </div>
        )}
      </div>

      <div className="register-form__field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          className={errors.confirmPassword ? 'error' : ''}
          placeholder="Confirm your password"
          disabled={loading}
        />
        {errors.confirmPassword && (
          <div className="register-form__error">
            <AlertCircle size={14} />
            {errors.confirmPassword}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="register-form__submit"
        loading={loading}
        icon={<UserPlus size={20} />}
      >
        Create Account
      </Button>

      <div className="register-form__footer">
        <p>Already have an account?</p>
        <Link to="/login">Sign in here</Link>
      </div>
    </form>
  );
};
