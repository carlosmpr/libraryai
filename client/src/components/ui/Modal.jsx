/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({
  buttonTitle,
  modalId,
  title,
  description,
  children,
  customStyle = 'modal-box',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = document.getElementById(modalId);

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [modalId, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-secondary">{buttonTitle}</button>
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
            onClick={handleClose}
          >
            <XMarkIcon className="w-6" />
          </button>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
