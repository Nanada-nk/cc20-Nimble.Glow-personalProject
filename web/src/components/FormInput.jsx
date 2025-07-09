import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react';

function FormInput({ label, name, register, error, type = "text", placeholder, autoComplete }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  let inputType;
  if (type === 'password' && isPasswordVisible === true) {
    inputType = 'text';
  } else {
    inputType = type;
  }
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="font-bold text-gray-700 text-sm">
        {label}
      </label>

      <div className="relative">

        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full px-3 py-2 bg-bg-cr2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-pri-gr1 placeholder:text-gray-600 text-sm"
          {...register(name)}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
          >
            {isPasswordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default FormInput;