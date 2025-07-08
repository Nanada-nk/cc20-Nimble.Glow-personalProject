function RadioGroupInput({ label, name, selectedValue, onChange, options = [] }) {
  return (
    <div className='form-control w-full flex'>
      <label className='label'>
        <span className='label-text pr-7'>{label}</span>
      </label>
      <div className='flex gap-4'>

        {options.map((option) => (
          <label key={option.label} className='label cursor-pointer'>
            <span className='label-text mr-2'>{option.label}</span>
            <input
              type="radio"
              name={name}
              className={`radio ${option.className || ''}`}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
export default RadioGroupInput