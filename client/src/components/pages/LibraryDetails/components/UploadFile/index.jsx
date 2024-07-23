import { useState } from "react";
import Modal from "../../../../ui/Modal";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import LoadingIndicator from "../../../../ui/LoadingIndiicator";
import useLoadingIndicator from "../../../../hooks/useLoadingIndicator";
import UploadForm from "./UploadForm";
import DirView from "./DirView";
import { useLibrary } from "../../context/LibraryContext";
import { useInstructions } from "../../../../context/UserInstructions";

const UploadFile = () => {
  const { repoName, loadContents, uploadPath,setUploadPath } = useLibrary();
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newDirectory, setNewDirectory] = useState("");
  const [error, setError] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const { userInstructions } = useInstructions();

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0 || !(uploadPath || newDirectory)) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("repository", repoName);
    formData.append("path", uploadPath || newDirectory);

    if (selectedInstruction) {
      const instruction = userInstructions.find(inst => inst.id === selectedInstruction);
      formData.append("instructionName", instruction.name);
      formData.append("model", instruction.model);
      formData.append("instructions", instruction.instructions);
    }

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
    setNewDirectory("");
    setIsModalOpen(false);
    setSelectedInstruction("");
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
        customStyle="w-[1050px] h-[90%] p-10 rounded-2xl"
      >
        <LoadingIndicator
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          successMessage="File uploaded successfully!"
          errorMessage="Failed to upload file."
          onSuccess={loadContents}
        >
          <UploadForm
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            setError={setError}
            error={error}
            handleClearFiles={handleClearFiles}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            newDirectory={newDirectory}
            setNewDirectory={setNewDirectory}
            selectedInstruction={selectedInstruction}
            setSelectedInstruction={setSelectedInstruction}
            dirView={<DirView />}
          />
        </LoadingIndicator>
      </Modal>
    </>
  );
};

export default UploadFile;
