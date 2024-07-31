
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Popup = ({
  popupId,
  title,
  description,
  isOpen,
  onClose,
  isLoading,
  isSuccess,
  isError,
  successMessage,
  errorMessage,
  children,
  customStyle = 'modal-box',
  onSuccess,
  progress
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const dialog = document.getElementById(popupId);

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

    dialog.addEventListener('close', handleClose);

    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, [popupId, isOpen, onClose]);

  useEffect(() => {
    if (isLoading) {
      setShowMessage(false);
    } else if (isSuccess || isError) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        if (isSuccess && onSuccess) {
          onSuccess();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSuccess, isError, onSuccess]);

  return (
    <dialog id={popupId} className="modal">
      <div className={`relative bg-base-200 border border-2 border-black shadow-2xl shadow-white/40 ${customStyle}`}>
        <div className="text-center my-10 space-y-1">
          <h2 className="font-bold text-3xl">{title}</h2>
          <p className="text-base-content/70 text-sm">{description}</p>
        </div>
        <div className="relative h-full">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0  z-10 "
              >
            
                
                <div className="flex">
                  <span className="loading loading-dots loading-lg"></span>
                  <span className="loading loading-dots loading-lg"></span>
                  <span className="loading loading-dots loading-lg"></span>
                  <span className="loading loading-dots loading-lg"></span>
                </div>

                {progress !== undefined && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <p className="bg-gray-800 text-white text-8xl px-3 py-1 rounded-md">
                      {progress}%
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showMessage && (
              <motion.div
                key="message"
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-10"
              >
                <div className={`message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                  {isSuccess ? successMessage : errorMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isLoading && !showMessage && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {children}
            </motion.div>
          )}
        </div>
        <button type="button" className="absolute top-5 right-10" onClick={onClose}>
          <XMarkIcon className="w-6" />
        </button>
      </div>
    </dialog>
  );
};

export default Popup;
