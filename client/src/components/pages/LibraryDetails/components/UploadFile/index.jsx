import { useState, useEffect, useCallback } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../../../../hooks/useLoadingIndicator";
import UploadForm from "./UploadForm";
import DirView from "./DirView";
import { useLibrary } from "../../context/LibraryContext";
import { useInstructions } from "../../../../context/UserInstructions";
import { useMainLibrary } from "../../../../context/MainLibraryContext";
import Popup from "../../../../ui/PopUp";

function UploadFile() {
  const { repoName, loadContents, uploadPath, setUploadPath } = useLibrary();
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newDirectory, setNewDirectory] = useState("");
  const [error, setError] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const { userInstructions } = useInstructions();
  const { userProfile } = useMainLibrary(); // Get userProfile from MainLibraryContext
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setUploadPath(newDirectory ? "" : uploadPath);
  }, [newDirectory, uploadPath, setUploadPath]);

  useEffect(() => {
    let ws;
    if (isModalOpen && userProfile?.id) {
      ws = new WebSocket(`ws://localhost:8080`, userProfile.id);
      console.log(userProfile.id)

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.progress !== undefined) {
          console.log(`Upload progress: ${data.progress}%`);
          setProgress(data.progress);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isModalOpen, userProfile]);

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

    const result = await response.json();
    console.log("File upload response:", result); // Log the result from the server
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
    setProgress(0);
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
        <div className="mt-4">
          <p>Upload Progress: {progress}%</p>
        </div>
      </Popup>
    </>
  );
}

export default UploadFile;
