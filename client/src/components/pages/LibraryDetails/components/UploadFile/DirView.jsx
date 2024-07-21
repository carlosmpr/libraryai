/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

const DirView = ({ contents, fetchContents, setUploadPath }) => {
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
          ) : null}
        </li>
      ))}
    </ul>
  );

  return <div>{renderTree(contents)}</div>;
};

export default DirView;
