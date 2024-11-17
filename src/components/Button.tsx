import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "reset" | "submit";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick = () => {},
  variant = "primary",
  type = "button",
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = "px-4 py-2 rounded focus:outline-none";
  const widthClasses = fullWidth ? "w-full" : "";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-black hover:bg-gray-400";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${widthClasses}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
