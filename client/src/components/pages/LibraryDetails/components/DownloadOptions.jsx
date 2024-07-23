/* eslint-disable react/prop-types */
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const DownloadOptions = ({ downloadUrl, repoName }) => {
  return (
    <div className="relative group">
      <a
        href={downloadUrl || "#"}
        download={downloadUrl ? `${repoName}.md` : ""}
        className={`btn btn-accent flex justify-center rounded-2xl ${!downloadUrl && "pointer-events-none"}`}
      >
        <DocumentTextIcon className="w-8" />
        <span>Download MD</span>
      </a>
      <div className="absolute hidden group-hover:flex flex-col items-center bg-white border border-black shadow-lg p-2 rounded-lg mb-2 bottom-full pointer-events-auto">
        <a
          href={downloadUrl || "#"}
          download={downloadUrl ? `${repoName}.md` : ""}
          className="btn btn-outline btn-primary w-full mb-2"
        >
          Get One File
        </a>
        <button
          className="btn btn-outline btn-primary w-full"
          onClick={() => alert("Download Complete Directory is not implemented yet.")}
        >
          Download Complete Dir
        </button>
      </div>
    </div>
  );
};

export default DownloadOptions;
