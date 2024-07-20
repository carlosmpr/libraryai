/* eslint-disable react/prop-types */
import FileDropZone from "./FileDropZone";

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
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <FileDropZone
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        setError={setError}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="button" onClick={handleClearFiles} className="btn btn-secondary mb-4">
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
      <button type="submit" disabled={isLoading || !uploadPath} className="btn btn-primary">
        {isLoading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
};

export default UploadForm;
