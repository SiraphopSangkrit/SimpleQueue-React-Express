import { Label } from "./Label";
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
      <Label label={label} className="mb-2" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        name={name}
        className={`w-full input ${className}  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      />
    </div>
  );
}