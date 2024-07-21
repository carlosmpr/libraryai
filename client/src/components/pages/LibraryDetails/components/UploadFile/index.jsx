/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../../../ui/Modal";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import LoadingIndicator from "../../../../ui/LoadingIndiicator";
import useLoadingIndicator from "../../../../hooks/useLoadingIndicator";
import UploadForm from "./UploadForm";

const UploadFile = ({ repoName, loadContents, contents }) => {
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadPath, setUploadPath] = useState("");
  const [newDirectory, setNewDirectory] = useState(""); // New state for the new directory input
  const [error, setError] = useState("");

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0 || (!uploadPath && !newDirectory)) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("repository", repoName);
    formData.append("path", newDirectory || uploadPath); // Use newDirectory if it's set

    const response = await fetch("/api/upload-file", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.ok) {
      handleModalClose();
    } else {
      console.error("Failed to upload file");
      throw new Error("Failed to upload file");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoading(handleFileUpload);
  };

  const handleModalClose = () => {
    setSelectedFiles([]);
    setError("");
    setUploadPath("");
    setNewDirectory(""); // Reset new directory input
    setIsModalOpen(false);
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    setError("");
  };

  return (
    <>
      <button
        className="btn btn-outline btn-secondary rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <ArrowUpTrayIcon className="w-8" />
        Add new File
      </button>
      <Modal
        modalId="upload_file_modal"
        title="Upload New File"
        description="Select a file to upload to the repository."
        isOpen={isModalOpen}
        onClose={handleModalClose}
        customStyle="w-[80%] h-[90%] p-10 rounded-2xl "
      >
        <LoadingIndicator
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          successMessage="File uploaded successfully!"
          errorMessage="Failed to upload file."
          onSuccess={() => {
            loadContents();
          }}
        >
          <UploadForm
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            setError={setError}
            error={error}
            handleClearFiles={handleClearFiles}
            contents={contents}
            uploadPath={uploadPath}
            setUploadPath={setUploadPath}
            newDirectory={newDirectory} // Pass new directory state
            setNewDirectory={setNewDirectory} // Pass setter for new directory
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </LoadingIndicator>
      </Modal>
    </>
  );
};

export default UploadFile;