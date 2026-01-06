interface SpeakerButtonProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}

export default function SpeakerButton({
  onClick,
  size = "md",
  variant = "primary",
}: SpeakerButtonProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const variantClasses = {
    primary: "bg-green-500 hover:bg-green-600 text-white",
    secondary: "bg-blue-500 hover:bg-blue-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        flex items-center justify-center
        rounded-full
        transition-all
        active:scale-95
        shadow-md
        hover:shadow-lg
      `}
      aria-label="Play pronunciation"
    >
      <svg
        className={iconSizes[size]}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.78 7.22a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" />
      </svg>
    </button>
  );
}
