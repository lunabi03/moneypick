import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "new" | "urgent" | "verified";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantStyles = {
    default: "bg-badge text-primary",
    new: "bg-[#E6F6FF] text-[#007DFF]",
    urgent: "bg-[#FFF4E0] text-[#FF9A1F]",
    verified: "bg-[#E8F9F0] text-[#2BA55D]",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-pill text-caption font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

