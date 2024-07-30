
import { useState } from 'react';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { useLibrary } from '../context/LibraryContext';

const FileTree = () => {
  const { contents, fetchContents, setUploadPath, handleFileClick } = useLibrary();
  const [openFolders, setOpenFolders] = useState({});
  const [cache, setCache] = useState({});

  const toggleFolder = async (path) => {
    if (!openFolders[path] && !cache[path]) {
      const fetchedContents = await fetchContents(path);
      setCache((prevCache) => ({
        ...prevCache,
        [path]: fetchedContents,
      }));
    }
    setOpenFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleDirectoryClick = (path) => {
    toggleFolder(path);
    setUploadPath(path);
  };

  const renderTree = (items, parentPath = '') => (
    <ul className="rounded-lg w-full">
      {items.map((item) => (
        <li key={item.path}>
          {item.type === 'dir' ? (
            <div>
              <div
                onClick={() => handleDirectoryClick(`${parentPath}/${item.name}`)}
                className="flex items-center cursor-pointer"
              >
                {openFolders[`${parentPath}/${item.name}`] ? (
                  <FolderOpenIcon className="w-4 h-4 mr-1" />
                ) : (
                  <FolderIcon className="w-4 h-4 mr-1" />
                )}
                <span>{item.name}</span>
              </div>
              {openFolders[`${parentPath}/${item.name}`] && (
                <div className="ml-4">
                  {renderTree(cache[`${parentPath}/${item.name}`] || [], `${parentPath}/${item.name}`)}
                </div>
              )}
            </div>
          ) : (
            <span
              onClick={() => handleFileClick(item)}
              style={{ cursor: 'pointer' }}
              className="flex items-center text-base-content/80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              {item.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  return <div>{renderTree(contents)}</div>;
};

export default FileTree;
