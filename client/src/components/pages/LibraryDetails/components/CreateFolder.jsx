/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../../ui/Modal";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../../../hooks/useLoadingIndicator";
import { useLibrary } from "../context/LibraryContext";
const CreateFolder = () => {
  const { repoName, loadContents } = useLibrary();
  const { isModalOpen, setIsModalOpen } = useLoadingIndicator();
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

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
          folderName: newFolderName,
          repository: repoName,
        }),
      });

      if (response.ok) {
        setNewFolderName("");
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
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            required
            className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
          />
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
