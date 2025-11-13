import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`bg-surface rounded-card p-6 shadow-card transition-all duration-180 ${
        onClick ? "cursor-pointer hover:shadow-lg active:scale-[0.98]" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

