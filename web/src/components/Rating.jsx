


function Rating({ rating = 0 }) {
  return (
    <div className="rating rating-sm">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <div
            key={starValue}
            className={`mask mask-heart ${starValue <= rating ? 'bg-green-900' : 'bg-gray-300'}`}
          />
        );
      })}
    </div>
  );
}

export default Rating;