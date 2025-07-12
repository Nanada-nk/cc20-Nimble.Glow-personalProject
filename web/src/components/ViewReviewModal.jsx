import { useEffect, useRef } from 'react';
import Rating from './Rating.jsx';


function ViewReviewModal({ isOpen, onClose, reviewData, productTitle }) {
  const modalRef = useRef(null);


  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  }

  const manageModalLifecycle = () => {
    const modal = modalRef.current;
    console.log('modal', modal)
    if (!modal) {
      return;
    }
    modal.addEventListener('close', handleClose);
    if (isOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
    return () => {
      modal.removeEventListener('close', handleClose);
    }
  }

  useEffect(() => {
    manageModalLifecycle()
  }, [isOpen]);


  if (!reviewData) return null;

  return (
    <dialog ref={modalRef} id="view_review_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 className="font-bold text-lg">{`Your Review for: ${productTitle}`}</h3>
        <div className="divider my-2"></div>

        <div className="space-y-4">
          <Rating rating={reviewData.rating} />
          <p className="p-4 bg-gray-100 rounded-md min-h-[100px] text-sm break-words">
            {reviewData.comment || "No comment provided."}
          </p>
          {reviewData.images && reviewData.images.length > 0 && (
            <div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {reviewData.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt="Review"
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default ViewReviewModal;