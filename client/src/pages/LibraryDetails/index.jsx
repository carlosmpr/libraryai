import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileTree from "./FileTree";
import UploadFile from "./UploadFile";
import CreateFolder from "./CreateFolder";
import FilePreview from "./FilePreview";

const testContents = [
  {
    path: "src",
    name: "src",
    type: "dir",
    contents: [
      {
        path: "src/components",
        name: "components",
        type: "dir",
        contents: [
          {
            path: "src/components/Button.js",
            name: "Button.js",
            type: "file",
            download_url: "https://example.com/Button.js",
          },
        ],
      },
      {
        path: "src/index.js",
        name: "index.js",
        type: "file",
        download_url: "https://example.com/index.js",
      },
    ],
  },
  {
    path: "README.md",
    name: "README.md",
    type: "file",
    download_url: "https://example.com/README.md",
  },
];

const LibraryDetails = () => {
  const { repoName } = useParams();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [uploadPath, setUploadPath] = useState("");

  const fetchContents = async (path = "") => {
    try {
      const response = await fetch(
        `/api/repository-contents?repo=${repoName}&path=${path}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.contents;
      } else {
        console.error("Failed to fetch repository contents");
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const loadContents = async () => {
    setLoading(true);
    const rootContents = await fetchContents();
    setContents(rootContents);
    setLoading(false);
  };

  useEffect(() => {
    loadContents();
  }, [repoName]);

  const handleFileClick = async (file) => {
    if (file.path.endsWith(".md")) {
      try {
        const response = await fetch(file.download_url);
        const text = await response.text();
        console.log("Fetched Markdown Content:", text);
        setSelectedFileContent(text);
      } catch (error) {
        console.error("Failed to fetch file content", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-base-200/40 h-screen">
      <div className="menu p-4 w-[20%]  bg-base-100 border-r-2  border-black shadow-2xl">
        <h1 className="text-xl mb-10 font-bold">{repoName}</h1>
        <FileTree
          contents={contents}
          handleFileClick={handleFileClick}
          fetchContents={fetchContents}
          setUploadPath={setUploadPath}
        />
      </div>
      <div className="flex  bg-base-200 flex-1 h-screen overflow-y-scroll px-20">
        {selectedFileContent && (
          <FilePreview selectedFileContent={selectedFileContent} />
        )}
      </div>
      <div className="fixed bottom-0">
        <div className="flex">
          <h2>Create New Folder</h2>
          <CreateFolder repoName={repoName} loadContents={loadContents} />
          <h2>Upload File</h2>
          <UploadFile
            repoName={repoName}
            loadContents={loadContents}
            uploadPath={uploadPath}
          />
        </div>
      </div>
    </div>
  );
};

export default LibraryDetails;
