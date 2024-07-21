/* eslint-disable react/prop-types */
import FileDropZone from "./FileDropZone";
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const UploadForm = ({
  selectedFiles,
  setSelectedFiles,
  setError,
  error,
  handleClearFiles,
  contents,
  uploadPath,
  setUploadPath,
  handleSubmit,
  isLoading,
  newDirectory,
  setNewDirectory
}) => {
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
    </form>
  );
};

export default UploadForm;
