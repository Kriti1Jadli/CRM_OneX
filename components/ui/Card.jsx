export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-3xl border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}