/** @format */


function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {

  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log('totalPages', totalPages)
 
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  console.log('pageNumbers', pageNumbers)
 
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`join-item btn bg-bg-cr border-none ${currentPage === number ? 'btn-active border-2 bg-pri-gr2' : ''}`}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pagination;