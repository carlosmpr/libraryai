/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../ui/Modal";
import { ArrowUpTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import LoadingIndicator from "../../ui/LoadingIndiicator";
import useLoadingIndicator from "../../hooks/useLoadingIndicator";

const UploadFile = ({ repoName, loadContents, contents }) => {
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadPath, setUploadPath] = useState("");
  const [error, setError] = useState("");

  const allowedExtensions = [".js", ".jsx", ".tsx"];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    const filesArray = [];

    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        if (isValidFile(file)) {
          filesArray.push(file);
        } else {
          setError("Invalid file type. Only .js, .jsx, and .tsx files are allowed.");
        }
      } else if (entry.isDirectory) {
        await traverseFileTree(entry, filesArray);
      }
    }

    if (filesArray.length + selectedFiles.length > 4) {
      setError("You can only upload a maximum of 4 files.");
    } else {
      setSelectedFiles([...selectedFiles, ...filesArray].slice(0, 4));
      setError("");
    }
  };

  const isValidFile = (file) => {
    return allowedExtensions.some((ext) => file.name.endsWith(ext));
  };

  const traverseFileTree = (item, filesArray) => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file) => {
          if (isValidFile(file)) {
            filesArray.push(file);
          }
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, filesArray);
          }
          resolve();
        });
      }
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const filteredFiles = files.filter(isValidFile);
    if (filteredFiles.length + selectedFiles.length > 4) {
      setError("You can only upload a maximum of 4 files.");
    } else {
      setSelectedFiles([...selectedFiles, ...filteredFiles].slice(0, 4));
      setError("");
    }
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0 || !uploadPath) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("repository", repoName);
    formData.append("path", uploadPath);

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
    setIsModalOpen(false)
   
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
      >
        <LoadingIndicator
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          successMessage="File uploaded successfully!"
          errorMessage="Failed to upload file."
          onSuccess={() => {
            handleModalClose();
            loadContents();
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer mb-4 h-[200px] flex overflow-y-scroll items-center justify-center"
            >
              <input
                type="file"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                id="fileUpload"
                multiple
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                {selectedFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-10">
                    {selectedFiles.map((file) => (
                      <div key={file.name}>
                        <DocumentTextIcon className="mx-auto w-8" />
                        <p>{file.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <ArrowUpTrayIcon className="mx-auto w-8" />
                    <p>
                      Drag & drop files or folders here, or click to select files
                    </p>
                  </div>
                )}
              </label>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="button"
              onClick={handleClearFiles}
              className="btn btn-secondary mb-4"
            >
              Clear Selected Files
            </button>
            <div className="mb-4">
              <h3>Select Directory:</h3>
              {contents
                .filter((item) => item.type === "dir")
                .map((item) => (
                  <div key={item.path} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="uploadPath"
                      value={item.path}
                      onChange={(e) => setUploadPath(e.target.value)}
                      className="radio radio-primary mr-2"
                      required
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
            </div>
            <button
              type="submit"
              disabled={isLoading || !uploadPath}
              className="btn btn-primary"
            >
              {isLoading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </LoadingIndicator>
      </Modal>
    </>
  );
};

export default UploadFile;
