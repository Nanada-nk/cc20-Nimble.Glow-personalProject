import { Controller } from 'react-hook-form';

function RatingInput({ control, name }) {
  return (
    <div>
      <label className="label"><span className="label-text">Rating</span></label>
      <Controller
        name={name}
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <div className="rating gap-1">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <input
                  key={ratingValue}
                  type="radio"
                  name={name}
                  className={`mask mask-heart ${ratingValue <= value ? 'bg-red-400' : 'bg-gray-300'}`}
                  checked={ratingValue === value}
                  onChange={() => onChange(ratingValue)}
                />
              );
            })}
          </div>
        )}
      />
    </div>
  );
}

export default RatingInput;