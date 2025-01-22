import React, { createContext, useContext} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext)


 // Funkcja do wyświetlenia modala
 const showModal = ({ title, text, icon, confirmButtonText, cancelButtonText, onConfirm, onCancel }) => {
    MySwal.fire({
      title,
      text,
      icon,
      showCancelButton: !!cancelButtonText, // Pokazuje przycisk "Anuluj", jeśli `cancelButtonText` jest ustawiony
      confirmButtonText: confirmButtonText || 'OK',
      cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm(); // Wywołuje `onConfirm`, jeśli użytkownik kliknie przycisk "Potwierdź"
      } else if (result.isDismissed && onCancel) {
        onCancel(); // Wywołuje `onCancel`, jeśli użytkownik kliknie przycisk "Anuluj"
      }
    });
  };


export const ModalProvider = ({children}) => {
    return (
        <ModalContext.Provider value={{ showModal }}>
          {children}
        </ModalContext.Provider>
      );
}