import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const useConfirm = () => {
  const confirm = ({
    title = 'Are you sure?',
    text = "You won't be able to revert this!",
    icon = 'warning',
    confirmButtonText = 'Yes, delete it!',
    cancelButtonText = 'Cancel'
  }) => {
    return MySwal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      customClass: {
        confirmButton: 'btn btn-error mx-2',
        cancelButton: 'btn btn-ghost mx-2'
      },
      buttonsStyling: false 
    });
  };

  return confirm;
};

export default useConfirm;