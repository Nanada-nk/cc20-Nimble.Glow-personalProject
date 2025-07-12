/** @format */

function ImageModal({ modalId, imageUrl, altText }) {

 
  if (!imageUrl) {
    return null;
  }

  return (
    <>
     
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box min-w-8/12 p-0 bg-transparent shadow-none">
         
          <img src={imageUrl} alt={altText} className="w-full h-auto rounded-lg" />
        </div>
        
       
        <label className="modal-backdrop" htmlFor={modalId}>Close</label>
      </div>
    </>
  );
}

export default ImageModal;