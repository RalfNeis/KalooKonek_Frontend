import React from 'react';

// 1. Define the 'Contract'
interface BadgeProps {
  text: string;
  // We define specific 'variants' to match your UI colors
  variant: 'danger' | 'warning' | 'success' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ text, variant }) => {
  // 2. Create a mapping for Tailwind classes
  // This keeps the JSX clean and readable
  const variantStyles = {
    danger: "bg-red-50 text-red-500 border-red-100",
    warning: "bg-orange-50 text-orange-600 border-orange-100",
    success: "bg-green-50 text-green-500 border-green-100",
    info: "bg-blue-50 text-blue-500 border-blue-100",
  };

  return (
    <span className={`
      px-3 py-1 
      rounded-full 
      text-[10px] 
      font-bold 
      border 
      transition-all
      ${variantStyles[variant]}
    `}>
      {text}
    </span>
  );
};

export default Badge;