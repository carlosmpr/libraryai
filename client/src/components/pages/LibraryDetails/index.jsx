import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import FileTree from "./components/FileTree";
import UploadFile from "./components/UploadFile";
import CreateFolder from "./components/CreateFolder";
import MarkDownPreview from "../../ui/MarkDownPreview";
import DownloadOptions from "./components/DownloadOptions";
import CodeDownload from "./components/CodeDownload";
import Breadcrumbs from "../../ui/BreadCrumbs";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Skeleton from "../../ui/Skeleton";

const LibraryDetails = () => {
  const { repoName } = useParams();
  const location = useLocation();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [uploadPath, setUploadPath] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

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
        setSelectedFileContent(text);
        setDownloadUrl(file.download_url);
      } catch (error) {
        console.error("Failed to fetch file content", error);
      }
    }
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <>
      <div className="flex bg-base-200/40 h-screen">
        <div className="p-4 w-[20%] bg-base-100 border-r-2 border-black shadow-2xl overflow-y-scroll">
          <h1 className="text-xl mb-10 font-bold">{repoName}</h1>
          <FileTree
            contents={contents}
            handleFileClick={handleFileClick}
            fetchContents={fetchContents}
            setUploadPath={setUploadPath}
          />
        </div>
        <div className="flex flex-col bg-base-200 flex-1 h-screen overflow-y-scroll px-20">
          <Breadcrumbs />
          {selectedFileContent && (
            <MarkDownPreview selectedFileContent={selectedFileContent} />
          )}
        </div>
        <div className="fixed w-full bottom-0">
          <div className="ml-[20%] flex w-full bg-base-100 p-4 mx-auto border-t-2 border-black gap-4">
            <CreateFolder repoName={repoName} loadContents={loadContents} />

            <UploadFile
              repoName={repoName}
              loadContents={loadContents}
              uploadPath={uploadPath}
              contents={contents}
              fetchContents={fetchContents}
            />

            <DownloadOptions downloadUrl={downloadUrl} repoName={repoName} />

            <CodeDownload
              selectedFileContent={selectedFileContent}
              repoName={repoName}
            />

            <Link
              to={`${location.pathname}/customizeprompt`}
              className="btn border-2 justify-center rounded-2xl"
            >
              <Cog6ToothIcon className="w-8" />
              <span className="text-xs">Customize Prompt</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryDetails;
