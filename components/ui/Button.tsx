import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "font-medium rounded-pill transition-all duration-180 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-[#2363C8] active:bg-[#2363C8] disabled:bg-[#CCE1FF] disabled:cursor-not-allowed",
    secondary: "bg-surface text-primary border border-primary hover:bg-[#E6F0FF] active:bg-[#D4E4FF] disabled:bg-[#DCE6F6] disabled:cursor-not-allowed",
    ghost: "bg-transparent text-primary hover:bg-[#E6F0FF] active:bg-[#D4E4FF]",
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-body-s",
    md: "px-6 py-3 text-body-m",
    lg: "px-8 py-4 text-body-l",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

