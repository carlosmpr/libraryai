/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({
  modalId,
  title,
  description,
  children,
  isOpen,
  onClose,
  customStyle='modal-box',
}) => {
  useEffect(() => {
    const dialog = document.getElementById(modalId);

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    const handleClose = () => {
      if (onClose) {
        onClose();
      }
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [modalId, isOpen, onClose]);

  return (
    <>
      <dialog id={modalId} className="modal">
        <div
          className={`relative bg-base-200 border border-2 border-black shadow-2xl shadow-white/40 ${customStyle}`}
        >
          <div className="text-center my-10 space-y-1">
            <h2 className="font-bold text-3xl">{title}</h2>
            <p className="text-base-content/70 text-sm">{description}</p>
          </div>
          {children}
          
            <button
              type="button"
              className="absolute top-5 right-10"
              onClick={onClose}
            >
              <XMarkIcon className="w-6" />
            </button>
          
        </div>
      </dialog>
    </>
  );
};

export default Modal;
