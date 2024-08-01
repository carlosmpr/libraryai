import { useState, useEffect, useCallback } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../../../../hooks/useLoadingIndicator";
import UploadForm from "./UploadForm";
import DirView from "./DirView";
import { useLibrary } from "../../context/LibraryContext";
import { useInstructions } from "../../../../context/UserInstructions";
import { useMainLibrary } from "../../../../context/MainLibraryContext";
import Popup from "../../../../ui/PopUp";
import { useLocalization } from "../../../../context/LocalizationContext";

const englishText = {
  addNewFile: "Add New File",
  uploadNewFile: "Upload New File",
  selectFile: "Select a file to upload to the repository.",
  successMessage: "File uploaded successfully!",
  errorMessage: "Failed to upload file.",
};

const spanishText = {
  addNewFile: "Subir Documentos",
  uploadNewFile: "Subir Nuevo Archivo",
  selectFile: "Seleccione un archivo para subir al repositorio.",
  successMessage: "¡Archivo subido con éxito!",
  errorMessage: "Error al subir el archivo.",
};

const UploadFile = () => {
  const { repoName, loadContents, uploadPath, setUploadPath } = useLibrary();
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newDirectory, setNewDirectory] = useState("");
  const [error, setError] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const { userInstructions } = useInstructions();
  const { userProfile } = useMainLibrary();
  const [progress, setProgress] = useState(0);
  const { isSpanish } = useLocalization();
  const text = isSpanish ? spanishText : englishText;

  useEffect(() => {
    setUploadPath(newDirectory ? "" : uploadPath);
  }, [newDirectory, uploadPath, setUploadPath]);

  useEffect(() => {
    let ws;
    if (isModalOpen && userProfile?.id) {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsHost = window.location.host;
      const wsUrl = `${wsProtocol}//${wsHost}`;

      ws = new WebSocket(wsUrl, userProfile.id);
      console.log("User ID:", userProfile.id);

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
      const instruction = userInstructions.find((inst) => inst.id === selectedInstruction);
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
    console.log("File upload response:", result);
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

  console.log(progress);

  return (
    <>
      <button className="btn btn-outline btn-secondary rounded-2xl" onClick={() => setIsModalOpen(true)}>
        <ArrowUpTrayIcon className="w-8" />
        {text.addNewFile}
      </button>
      <Popup
        popupId="upload_file_modal"
        title={text.uploadNewFile}
        description={text.selectFile}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage={text.successMessage}
        errorMessage={text.errorMessage}
        onSuccess={loadContents}
        customStyle="w-[1050px] h-[90%] p-10 rounded-2xl overflow-y-scroll"
        progress={progress}
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
};

export default UploadFile;
