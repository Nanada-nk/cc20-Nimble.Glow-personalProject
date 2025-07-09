function SelectInput({ label, name, register, error, options = []  }) {
  return (
    <div className="form-control w-full pb-5">
      <label className="label">
        <span className="label-text pr-10">{label}</span>
      </label>
      <select
      className="select select-bordered"
      {...register(name)}
      >
        <option value="">-- Please select --</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  )
}
export default SelectInput