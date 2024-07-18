/* eslint-disable react/prop-types */
import { useState } from 'react';

const CreateFolder = ({ repoName, loadContents }) => {
    const [newFolderName, setNewFolderName] = useState('');
    const [creatingFolder, setCreatingFolder] = useState(false);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        setCreatingFolder(true);

        try {
            const response = await fetch('/api/create-folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ folderName: newFolderName, repository: repoName })
            });

            if (response.ok) {
                setNewFolderName('');
                loadContents();
            } else {
                console.error('Failed to create folder');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setCreatingFolder(false);
        }
    };

    return (
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
    );
};

export default CreateFolder;
