/* eslint-disable react/prop-types */

import Modal from '../../../ui/Modal';
import LoadingIndicator from '../../../ui/LoadingIndiicator';

const LoadingModal = ({ isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, successMessage, errorMessage, onSuccess }) => {
  return (
    <Modal
      modalId="loading_modal"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Processing"
      description="Please wait while we process your request."
    >
      <LoadingIndicator
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSuccess={onSuccess}
      >
        <div></div> {/* Empty div to keep the loading state functionality */}
      </LoadingIndicator>
    </Modal>
  );
};

export default LoadingModal;
