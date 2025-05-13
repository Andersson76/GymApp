"use client";

import React from "react";

type IconButtonProps = {
  icon: string;
  onClick: () => void;
  title?: string;
  className?: string;
};

export default function IconButton({
  icon,
  onClick,
  title,
  className = "",
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-gray-600 text-xl hover:shadow-md hover:scale-105 active:scale-95 transition-all rounded-full p-2 ${className}`}
      title={title}
      aria-label={title || "Icon button"}
    >
      {icon}
    </button>
  );
}
