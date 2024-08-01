import { useState } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../../../hooks/useLoadingIndicator";
import { useLibrary } from "../context/LibraryContext";
import DirStructureOptions from "./DirStructureOptions";
import Popup from "../../../ui/PopUp";
import { useLocalization } from "../../../context/LocalizationContext";

const englishText = {
  addStructure: "Add Structure",
  addNewFolder: "Add New Folder",
  selectStructure: "Select a folder structure to add.",
  creating: "Creating...",
  createFolder: "Create Folder",
  successMessage: "Folder created successfully!",
  errorMessage: "Failed to create folder.",
};

const spanishText = {
  addStructure: "Agregar Estructura",
  addNewFolder: "Agregar Nueva Carpeta",
  selectStructure: "Seleccione una estructura de carpeta para agregar.",
  creating: "Creando...",
  createFolder: "Crear Carpeta",
  successMessage: "¡Carpeta creada con éxito!",
  errorMessage: "Error al crear la carpeta.",
};

const CreateFolder = () => {
  const { repoName, loadContents } = useLibrary();
  const { isModalOpen, setIsModalOpen, isLoading, isSuccess, isError, handleLoading } = useLoadingIndicator();
  const [selectedStructure, setSelectedStructure] = useState(null);
  const { isSpanish } = useLocalization();
  const text = isSpanish ? spanishText : englishText;

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
      console.log(response);
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
    setSelectedStructure(null);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-neutral rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <FolderPlusIcon className="w-8" />
        {text.addStructure}
      </button>
      <Popup
        popupId="create_folder_modal"
        title={text.addNewFolder}
        description={text.selectStructure}
        isOpen={isModalOpen}
        onClose={handleClose}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage={text.successMessage}
        errorMessage={text.errorMessage}
        onSuccess={loadContents}
        customStyle="w-[500px] p-5 rounded-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <DirStructureOptions onSelect={handleStructureSelect} selectedStructure={selectedStructure} />
          <button
            type="submit"
            disabled={isLoading || !selectedStructure}
            className="btn btn-primary mt-4"
          >
            {isLoading ? text.creating : text.createFolder}
          </button>
        </form>
      </Popup>
    </>
  );
};

export default CreateFolder;
