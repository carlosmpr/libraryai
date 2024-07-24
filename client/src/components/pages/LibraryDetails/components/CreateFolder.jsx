/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../../ui/Modal";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../../../hooks/useLoadingIndicator";
import { useLibrary } from "../context/LibraryContext";

import DirStructureOptions from './DirStructureOptions';

const CreateFolder = () => {
  const { repoName, loadContents } = useLibrary();
  const { isModalOpen, setIsModalOpen } = useLoadingIndicator();
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setCreatingFolder(true);

    try {
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
        
        loadContents();
      } else {
        console.error("Failed to create folder");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleStructureSelect = (structure) => {
    setSelectedStructure(structure);
   
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
      <Modal
        isOpen={isModalOpen}
        modalId="create_folder_modal"
        title="Add New Folder"
        description="Enter the name of the new folder."
        triggerButtonLabel="Add New Folder"
        triggerButtonClass="btn-outline btn-primary"
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleCreateFolder}>
        <DirStructureOptions onSelect={handleStructureSelect} selectedStructure={selectedStructure} />
          <button
            type="submit"
            disabled={creatingFolder}
            className="btn btn-primary"
          >
            {creatingFolder ? "Creating..." : "Create Folder"}
          </button>
        </form>
      </Modal>
     

    </>
  );
};

export default CreateFolder;
