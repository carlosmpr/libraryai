import FileDropZone from "./FileDropZone";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useLibrary } from "../../context/LibraryContext";
import { useInstructions } from "../../../../context/UserInstructions";
import { useLocalization } from "../../../../context/LocalizationContext";

const englishText = {
  directoryPath: "Directory Path:",
  selectedDirectoryPath: "Selected Directory Path",
  createNewDirectory: "Create New Directory:",
  newDirectoryName: "New Directory Name",
  customInstruction: "Custom Instruction:",
  selectDirectory: "Select a Directory:",
  uploading: "Uploading...",
  uploadFile: "Upload File",
};

const spanishText = {
  directoryPath: "Ruta del Directorio:",
  selectedDirectoryPath: "Ruta del Directorio Seleccionado",
  createNewDirectory: "Crear Nuevo Directorio:",
  newDirectoryName: "Nombre del Nuevo Directorio",
  customInstruction: "Instrucción Personalizada:",
  selectDirectory: "Seleccione un Directorio:",
  uploading: "Subiendo...",
  uploadFile: "Subir Archivo",
};

const UploadForm = ({
  selectedFiles,
  setSelectedFiles,
  setError,
  error,
  handleClearFiles,
  handleSubmit,
  isLoading,
  newDirectory,
  setNewDirectory,
  selectedInstruction,
  setSelectedInstruction,
  dirView,
}) => {
  const { uploadPath, setUploadPath } = useLibrary();
  const { userInstructions, loading } = useInstructions();
  const { isSpanish } = useLocalization();
  const text = isSpanish ? spanishText : englishText;

  return (
    <form onSubmit={handleSubmit} className="flex gap-10 justify-evenly">
      <div className="relative flex-1">
        <FileDropZone
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setError={setError}
        />
        <button
          type="button"
          onClick={handleClearFiles}
          className="btn bg-transparent top-0 absolute"
        >
          <ArrowPathIcon className="w-6" />
        </button>
      </div>
      <div className="w-[35%]">
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4">
          <h3>{text.directoryPath}</h3>
          <input
            type="text"
            value={uploadPath}
            readOnly
            onChange={(e) => setUploadPath(e.target.value)}
            placeholder={text.selectedDirectoryPath}
            className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
          />
        </div>

        <div className="mb-4">
          <h3>{text.createNewDirectory}</h3>
          <input
            type="text"
            value={newDirectory}
            onChange={(e) => setNewDirectory(e.target.value)}
            placeholder={text.newDirectoryName}
            className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
          />
        </div>

        {!loading && (
          <div className="mb-4 w-full">
            <h3 className="font-semibold">{text.customInstruction}</h3>
            <div className="flex overflow-x-scroll gap-2 w-full mt-4">
              {userInstructions.map((instruction) => (
                <button
                  key={instruction.id}
                  type="button"
                  className={`btn ${
                    selectedInstruction === instruction.id ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setSelectedInstruction(instruction.id)}
                >
                  {instruction.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !(uploadPath || newDirectory)}
          className="btn btn-primary"
        >
          {isLoading ? text.uploading : text.uploadFile}
        </button>
      </div>
      <div className="flex flex-col flex-1 mb-4 overflow-y-scroll">
        <h3 className="font-semibold">{text.selectDirectory}</h3>
        {dirView}
      </div>
    </form>
  );
};

export default UploadForm;
