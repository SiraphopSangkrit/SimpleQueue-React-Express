export function Input({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className ='',
  name,
  boxClassName = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  name?: string;
  boxClassName?: string;
}) {
  return (
    <div className={`w-full ${boxClassName}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        name={name}
        className={`w-full input ${className}`}
      />
    </div>
  );
}