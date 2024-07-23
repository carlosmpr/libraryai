/* eslint-disable react/prop-types */
import  { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children, repoName }) => {
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

  return (
    <LibraryContext.Provider
      value={{
        contents,
        loading,
        selectedFileContent,
        uploadPath,
        downloadUrl,
        setUploadPath,
        handleFileClick,
        fetchContents,
        loadContents,
        setSelectedFileContent,
        repoName
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
