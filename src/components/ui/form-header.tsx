interface FormHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function FormHeader({
  title,
  subtitle,
  className = "",
}: FormHeaderProps) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
}
