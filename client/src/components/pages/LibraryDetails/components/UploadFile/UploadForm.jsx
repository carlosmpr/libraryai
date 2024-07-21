/* eslint-disable react/prop-types */
import FileDropZone from "./FileDropZone";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useLibrary } from "../../context/LibraryContext";

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
  dirView,
}) => {
  const { uploadPath, setUploadPath } = useLibrary();

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
