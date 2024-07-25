/* eslint-disable react/prop-types */
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useMainLibrary } from "../../../context/MainLibraryContext";
const DownloadOptions = ({ selectedFileContent, repoName }) => {

  const { userProfile } = useMainLibrary();
  const extractTitle = (markdownContent) => {
    const titleMatch = markdownContent.match(/title:\s*'([^']+)'/);
    return titleMatch ? titleMatch[1].replace(/\.tsx$/, '.md') : "document.md";
  };

  const handleDownloadMarkdown = () => {
    if (selectedFileContent) {
      const title = extractTitle(selectedFileContent);
      const blob = new Blob([selectedFileContent], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);

      const downloadLink = document.getElementById('download-md-link');
      downloadLink.href = url;
      downloadLink.download = title;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert("Please select a markdown file to download.");
    }
  };

  const handleDownloadRepo = () => {
    const repoUrl = `https://github.com/${userProfile.username}/${repoName}/archive/refs/heads/main.zip`;
    window.open(repoUrl, '_blank');
  };

  return (
    <>
      <a id="download-md-link" style={{ display: 'none' }}></a>
      <div className="relative group">
        <a
          className={`btn btn-accent flex justify-center rounded-2xl cursor-pointer ${!selectedFileContent && "pointer-events-none"}`}
          onClick={handleDownloadMarkdown}
        >
          <DocumentTextIcon className="w-8" />
          <span>Download MD</span>
        </a>
        <div className="absolute hidden group-hover:flex flex-col items-center bg-white border border-black shadow-lg p-2 rounded-lg mb-2 bottom-full pointer-events-auto">
          <a
            className="btn btn-outline btn-primary w-full mb-2 cursor-pointer"
            onClick={handleDownloadMarkdown}
          >
            Get One File
          </a>
          <button
            className="btn btn-outline btn-primary w-full"
            onClick={handleDownloadRepo}
          >
            Download Complete Dir
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadOptions;
