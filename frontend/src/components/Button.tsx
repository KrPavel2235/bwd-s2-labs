import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
