interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`p-3 text-sm text-red-500 bg-red-50 rounded-md ${className}`}
    >
      {message}
    </div>
  );
}
