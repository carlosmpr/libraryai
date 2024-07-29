/* eslint-disable react/prop-types */
import { useState } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../../../hooks/useLoadingIndicator";
import { useLibrary } from "../context/LibraryContext";
import DirStructureOptions from './DirStructureOptions';
import Popup from "../../../ui/PopUp";

const CreateFolder = () => {
  const { repoName, loadContents } = useLibrary();
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedStructure, setSelectedStructure] = useState(null);

  const handleCreateFolder = async () => {
    const response = await fetch("/api/create-folder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        structure: selectedStructure,
        repository: repoName,
      }),
    });

    if (response.ok) {
     console.log(response)
      
    } else {
      console.error("Failed to create folder");
      throw new Error("Failed to create folder");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoading(handleCreateFolder);
  };

  const handleStructureSelect = (structure) => {
    setSelectedStructure(structure);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    loadContents();
    setSelectedStructure(null);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-neutral rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <FolderPlusIcon className="w-8" />
        Add Structure
      </button>
      <Popup
        popupId="create_folder_modal"
        title="Add New Folder"
        description="Select a folder structure to add."
        isOpen={isModalOpen}
        onClose={handleClose}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage="Folder created successfully!"
        errorMessage="Failed to create folder."
        onSuccess={loadContents}
        customStyle="w-[500px] p-5 rounded-2xl"
      >
        <form onSubmit={handleSubmit}>
          <DirStructureOptions onSelect={handleStructureSelect} selectedStructure={selectedStructure} />
          <button
            type="submit"
            disabled={isLoading || !selectedStructure}
            className="btn btn-primary mt-4"
          >
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </form>
      </Popup>
    </>
  );
};

export default CreateFolder;
