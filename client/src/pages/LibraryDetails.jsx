import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const LibraryDetails = () => {
    const { repoName } = useParams();
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newFolderName, setNewFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadPath, setUploadPath] = useState('');
    const [selectedFileContent, setSelectedFileContent] = useState('');

    const fetchContents = async (path = '') => {
        try {
            const response = await fetch(`/api/repository-contents?repo=${repoName}&path=${path}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include cookies in the request
            });

            if (response.ok) {
                const data = await response.json();
                return data.contents;
            } else {
                console.error('Failed to fetch repository contents');
                return [];
            }
        } catch (error) {
            console.error('Error:', error);
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

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        setCreatingFolder(true);

        try {
            const response = await fetch('/api/create-folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify({ folderName: newFolderName, repository: repoName })
            });

            if (response.ok) {
                setNewFolderName('');
                loadContents(); // Refresh the contents after creating a folder
            } else {
                console.error('Failed to create folder');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setCreatingFolder(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !uploadPath) return;

        setUploadingFile(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('repository', repoName);
        formData.append('path', uploadPath);

        try {
            const response = await fetch('/api/upload-file', {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
                body: formData
            });

            if (response.ok) {
                setSelectedFile(null);
                setUploadPath('');
                loadContents(); // Refresh the contents after uploading the file
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setUploadingFile(false);
        }
    };

    const handleFileClick = async (file) => {
        if (file.path.endsWith('.md')) {
            try {
                const response = await fetch(file.download_url);
                const text = await response.text();
                setSelectedFileContent(text);
            } catch (error) {
                console.error('Failed to fetch file content', error);
            }
        }
    };

    const renderTree = (items, parentPath = '') => {
        return (
            <ul>
                {items.map(item => (
                    <li key={item.path}>
                        {item.type === 'dir' ? (
                            <details>
                                <summary>
                                    📁 {item.name}
                                    <input
                                        type="radio"
                                        name="uploadPath"
                                        value={`${parentPath}/${item.name}`}
                                        onChange={(e) => setUploadPath(e.target.value)}
                                    />
                                </summary>
                                <DirectoryContents path={`${parentPath}/${item.name}`} />
                            </details>
                        ) : (
                            <span onClick={() => handleFileClick(item)} style={{ cursor: 'pointer', color: 'blue' }}>
                                📄 {item.name}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const DirectoryContents = ({ path }) => {
        const [dirContents, setDirContents] = useState([]);
        const [loadingDir, setLoadingDir] = useState(true);

        useEffect(() => {
            const loadDirContents = async () => {
                const contents = await fetchContents(path);
                setDirContents(contents);
                setLoadingDir(false);
            };
            loadDirContents();
        }, [path]);

        if (loadingDir) {
            return <div>Loading...</div>;
        }

        return renderTree(dirContents, path);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Contents of {repoName}</h1>
            {renderTree(contents)}
            <h2>Create New Folder</h2>
            <form onSubmit={handleCreateFolder}>
                <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    required
                />
                <button type="submit" disabled={creatingFolder}>
                    {creatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
            </form>
            <h2>Upload File</h2>
            <form onSubmit={handleFileUpload}>
                <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required
                />
                <button type="submit" disabled={uploadingFile || !uploadPath}>
                    {uploadingFile ? 'Uploading...' : 'Upload File'}
                </button>
            </form>
            {selectedFileContent && (
                <div>
                    <h2>File Preview</h2>
                    <ReactMarkdown>{selectedFileContent}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default LibraryDetails;
