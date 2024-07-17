import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LibraryDetails = () => {
    const { repoName } = useParams();
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newFolderName, setNewFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);

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

    const renderTree = (items) => {
        return (
            <ul>
                {items.map(item => (
                    <li key={item.path}>
                        {item.type === 'dir' ? (
                            <details>
                                <summary>📁 {item.name}</summary>
                                <DirectoryContents path={item.path} />
                            </details>
                        ) : (
                            <a href={item.download_url} target="_blank" rel="noopener noreferrer">
                                📄 {item.name}
                            </a>
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

        return renderTree(dirContents);
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
        </div>
    );
};

export default LibraryDetails;
