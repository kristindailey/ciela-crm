interface AuthInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
}

const AuthInput = ({ id, label, type, value, onChange, disabled = false, required = true }: AuthInputProps) => {
  return (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <input 
            type={type} 
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#535bf2] text-gray-900"
            disabled={disabled}
        />
    </div>
  );
};

export default AuthInput;