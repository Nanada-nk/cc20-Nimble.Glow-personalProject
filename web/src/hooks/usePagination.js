/** @format */
import { useState, useMemo } from 'react';


function usePagination(data, itemsPerPage) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // console.log('totalPages', totalPages)

 
  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [data, currentPage, itemsPerPage]);
  // console.log('currentData', currentData)

  
  const handlePageChange = (pageNumber) => {
   
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  // console.log('handlePageChange', handlePageChange)
  
  return { currentPage, currentData, handlePageChange, totalPages };
}

export default usePagination;