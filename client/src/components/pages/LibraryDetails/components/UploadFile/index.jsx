import { useState, useEffect, useCallback } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../../../../hooks/useLoadingIndicator";
import UploadForm from "./UploadForm";
import DirView from "./DirView";
import { useLibrary } from "../../context/LibraryContext";
import { useInstructions } from "../../../../context/UserInstructions";
import Popup from "../../../../ui/PopUp";

function UploadFile() {
  const { repoName, loadContents, uploadPath, setUploadPath } = useLibrary();
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newDirectory, setNewDirectory] = useState("");
  const [error, setError] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const { userInstructions } = useInstructions();

  useEffect(() => {
    setUploadPath(newDirectory ? "" : uploadPath);
  }, [newDirectory, uploadPath, setUploadPath]);

  const handleFileUpload = useCallback(async () => {
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

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
  }, [selectedFiles, uploadPath, newDirectory, repoName, selectedInstruction, userInstructions]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleLoading(handleFileUpload);
  }, [handleLoading, handleFileUpload]);

  const handleModalClose = useCallback(() => {
    setSelectedFiles([]);
    setError("");
    setUploadPath("");
    setNewDirectory("");
    setIsModalOpen(false);
    setSelectedInstruction("");
  }, [setUploadPath, setIsModalOpen]);

  const handleClearFiles = useCallback(() => {
    setSelectedFiles([]);
    setError("");
  }, []);

  return (
    <>
      <button
        className="btn btn-outline btn-secondary rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <ArrowUpTrayIcon className="w-8" />
        Add new File
      </button>
      <Popup
        popupId="upload_file_modal"
        title="Upload New File"
        description="Select a file to upload to the repository."
        isOpen={isModalOpen}
        onClose={handleModalClose}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage="File uploaded successfully!"
        errorMessage="Failed to upload file."
        onSuccess={loadContents}
        customStyle="w-[1050px] h-[90%] p-10 rounded-2xl"
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
      </Popup>
    </>
  );
}

export default UploadFile;