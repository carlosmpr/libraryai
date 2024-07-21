/* eslint-disable react/prop-types */
import FileDropZone from "./FileDropZone";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useLibrary } from "../../context/LibraryContext";
import { useInstructions } from "../../../../context/UserInstructions";

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
  const { instructions, loading } = useInstructions();

  return (
    <form onSubmit={handleSubmit} className="flex gap-10">
      <div className="relative">
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
      <div className="w-[45%]">
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4">
          <h3>Directory Path:</h3>
          <input
            type="text"
            value={uploadPath}
            onChange={(e) => setUploadPath(e.target.value)}
            placeholder="Selected Directory Path"
            className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
          />
        </div>

        <div className="mb-4">
          <h3>Create New Directory:</h3>
          <input
            type="text"
            value={newDirectory}
            onChange={(e) => setNewDirectory(e.target.value)}
            placeholder="New Directory Name"
            className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
          />
        </div>

        {!loading && (
          <div className="mb-4">
            <h3>Select Custom Prompt Instruction:</h3>
            <div className="flex flex-wrap gap-2">
              {instructions.map((instruction) => (
                <button
                  key={instruction.id}
                  type="button"
                  className={`btn ${selectedInstruction === instruction.id ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setSelectedInstruction(instruction.id)}
                >
                  {instruction.id}
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
          {isLoading ? "Uploading..." : "Upload File"}
        </button>
      </div>
      <div className="w-[45%]">
        <h3>Directory Tree:</h3>
        {dirView}
      </div>
    </form>
  );
};

export default UploadForm;
