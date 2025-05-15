export default function Input({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    isTextArea = false,
    options = []
}) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={name} className="text-sm font-medium">
                {label}
            </label>

            {isTextArea ? (
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="border rounded-md px-3 py-2 text-sm text-black dark:text-white bg-white dark:bg-darkBg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={4}
                />
            ) : type === 'select' ? (

  <select
    id={name}
    name={name}
    value={value}
    onChange={onChange}
    className="border rounded-md px-3 py-2 text-sm text-black dark:text-white bg-white dark:bg-darkBg focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <option value="" disabled>
      {placeholder || 'Select an option'}
    </option>
    {options.map((option, idx) => (
      <option key={idx} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>


            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="border rounded-md px-3 py-2 text-sm text-black dark:text-white bg-white dark:bg-darkBg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            )}
        </div>
    );
}
