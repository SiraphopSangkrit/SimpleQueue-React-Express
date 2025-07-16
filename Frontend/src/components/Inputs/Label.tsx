export function Label({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) {
  return (
    <label className={`block text-base font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`}>
      {label}
    </label>
  );
}