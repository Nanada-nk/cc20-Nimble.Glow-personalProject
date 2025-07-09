function Modal({ isOpen, onClose, onConfirm, title, children, confirmText = "Save", isConfirmDisabled = false }) {
  if (!isOpen) return null
  return (
    <div className='modal modal-open'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>{title}</h3>

        <div className="p-4">
          {children}
        </div>

          <div className='modal-action'>
              <button onClick={onConfirm} disabled={isConfirmDisabled} className='btn btn-primary'>{confirmText}</button>
              <button onClick={onClose} className='btn'>Cancel</button>
            </div>

      </div>
    </div>
  )
}
export default Modal