import Link from "next/link";

export default function Button({ children, variant = "primary", href, onClick, className = "", ...props }) {
  const baseClasses = "px-4 py-2 text-sm font-semibold rounded-full transition";

  const variants = {
    primary: "bg-rose-600 text-white hover:bg-rose-700",
    secondary: "border border-rose-300 bg-white text-rose-700 hover:bg-rose-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}