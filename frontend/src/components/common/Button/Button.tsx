import React from 'react';
import { clsx } from 'clsx';
import './Button.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                variant = 'primary',
                                                size = 'md',
                                                loading = false,
                                                icon,
                                                children,
                                                className,
                                                disabled,
                                                ...props
                                              }) => {
  return (
    <button
      className={clsx(
        'button',
        `button--${variant}`,
        `button--${size}`,
        {
          'button--loading': loading,
          'button--with-icon': !!icon,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="button__spinner" />}
      {icon && !loading && <span className="button__icon">{icon}</span>}
      <span className="button__text">{children}</span>
    </button>
  );
};
