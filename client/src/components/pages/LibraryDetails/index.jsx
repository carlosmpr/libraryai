/* eslint-disable no-undef */
import { useParams } from "react-router-dom";
import FileTree from "./components/FileTree";
import UploadFile from "./components/UploadFile";
import CreateFolder from "./components/CreateFolder";
import MarkDownPreview from "../../ui/MarkDownPreview";
import DownloadOptions from "./components/DownloadOptions";
import CodeDownload from "./components/CodeDownload";
import Breadcrumbs from "../../ui/BreadCrumbs";
import Skeleton from "../../ui/Skeleton";
import { LibraryProvider, useLibrary } from "./context/LibraryContext";
import SideBar from "../../ui/SideBar";


const LibraryDetailsContent = () => {
  const { repoName, loading, selectedFileContent, downloadUrl } = useLibrary();

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="flex bg-base-200/40 h-screen">
      <SideBar >
      <div className>
        <h1 className="text-xl mb-10 font-bold">{repoName}</h1>
        <FileTree />
      </div>
      </SideBar>
      <div className="flex flex-col bg-base-200 flex-1 h-screen overflow-y-scroll px-20">
        <Breadcrumbs />
        {selectedFileContent && (
          <MarkDownPreview selectedFileContent={selectedFileContent} />
        )}
      </div>
      <div className="fixed w-full bottom-0">
        <div className="ml-[20%] flex w-full bg-base-100 p-4 mx-auto border-t-2 border-black gap-4">
          <CreateFolder />

          <UploadFile />

          <DownloadOptions downloadUrl={downloadUrl} />

          <CodeDownload selectedFileContent={selectedFileContent} />
         
        </div>
      </div>
    </div>
  );
};

const LibraryDetails = () => {
  const { repoName } = useParams();

  return (
    <LibraryProvider repoName={repoName}>
      <LibraryDetailsContent />
    </LibraryProvider>
  );
};

export default LibraryDetails;
