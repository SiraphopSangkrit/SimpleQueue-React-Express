
interface BoxContentProps {
  id?: string;
  startTime?: string;
  endTime?: string;
  name?: string;
  checked?: boolean;
  onChange?: (value: string) => void;

}

export function BoxSelect({ id, startTime, endTime, name, checked, onChange }: BoxContentProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="relative flex flex-col bg-base-200 p-3 rounded-lg shadow-md cursor-pointer border border-gray-300 hover:border-green-500 transition duration-200"
      >
        <span className="font-bold text-gray-700 dark:text-gray-300">
          <span className="text-base">{startTime}</span>
          <span className="text-base"> - </span>
          <span className="text-base">{endTime}</span>
          <span className="text-base"> น.</span>
        </span>
        <input
          type="radio"
          name={name}
          id={id}
          value={id}
          checked={checked}
          onChange={() => onChange?.(id || '')}
          className="absolute h-0 w-0 appearance-none"
        />
        <span
          aria-hidden="true"
          className={`${checked ? 'block' : 'hidden'} absolute inset-0 border-2 border-green-500 bg-green-200/20 rounded-lg`}
        >
          <span className="absolute -top-3 -right-2 h-6 w-6 inline-flex items-center justify-center rounded-full bg-green-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-green-600"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </span>
      </label>
    </div>
  );
}
