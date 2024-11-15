import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };

  return (
    <button 
      className={cn(
        baseClasses, 
        variantClasses[variant], 
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
