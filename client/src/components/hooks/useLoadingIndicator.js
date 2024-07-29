import { useState, useEffect } from "react";

const useLoadingIndicator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLoading = async (loadingFunction) => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      await loadingFunction();
      setIsSuccess(true);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        if (isSuccess) {
          setIsModalOpen(false); // Close the modal on success
        }
        setIsSuccess(false);
        setIsError(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError]);

  return {
    isModalOpen,
    setIsModalOpen,
    isLoading,
    isSuccess,
    isError,
    handleLoading,
    setIsError,
    setIsSuccess
  };
};

export default useLoadingIndicator;
