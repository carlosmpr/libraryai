import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const LoadingIndicator = ({ isLoading, isSuccess, isError, successMessage, errorMessage, children, onSuccess }) => {
  const [showMessage, setShowMessage] = useState(false);

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
    <div className="relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
          >
            <div className='flex'>
              <span className="loading loading-dots loading-lg"></span>
              <span className="loading loading-dots loading-lg"></span>
              <span className="loading loading-dots loading-lg"></span>
              <span className="loading loading-dots loading-lg"></span>
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
      <AnimatePresence>
        {showMessage && (
          <motion.div
            key="message"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
          >
            <div className={`message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {isSuccess ? successMessage : errorMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingIndicator;
