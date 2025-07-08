function SelectInput({ label, value, onChange, options = [] }) {
  return (
    <div className="form-control w-full pb-5">
      <label className="label">
        <span className="label-text pr-10">{label}</span>
      </label>
      <select
      className="select select-bordered"
      value={value}
      onChange={onChange}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
export default SelectInput