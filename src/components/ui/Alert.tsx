// src/components/ui/Alert.tsx
import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  closable?: boolean;
  className?: string;
}

const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-400',
    iconComponent: CheckCircle
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800', 
    icon: 'text-red-400',
    iconComponent: AlertCircle
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-400', 
    iconComponent: AlertTriangle
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-400',
    iconComponent: Info
  }
};

export function Alert({ 
  variant = 'info', 
  title, 
  message, 
  onClose, 
  closable = false,
  className = '' 
}: AlertProps) {
  const styles = alertStyles[variant];
  const IconComponent = styles.iconComponent;

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${styles.icon}`} />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
        </div>

        {closable && onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:${styles.container} ${styles.icon} focus:ring-${variant}-600`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience components for specific variants
export function SuccessAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert {...props} variant="success" />;
}

export function ErrorAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert {...props} variant="error" />;
}

export function WarningAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert {...props} variant="warning" />;
}

export function InfoAlert(props: Omit<AlertProps, 'variant'>) {
  return <Alert {...props} variant="info" />;
}