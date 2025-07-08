function FormInput({ label, name, register, error, type = "text", placeholder, autoComplete }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="font-bold text-gray-700 text-sm">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="block w-full px-3 py-2 bg-bg-cr2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-pri-gr1 placeholder:text-gray-600 text-sm"
        {...register(name)} 
      />
     
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default FormInput;