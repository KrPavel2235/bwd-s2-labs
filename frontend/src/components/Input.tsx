import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputClasses = [
    styles.input,
    error ? styles.error : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input id={id} className={inputClasses} {...props} />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
