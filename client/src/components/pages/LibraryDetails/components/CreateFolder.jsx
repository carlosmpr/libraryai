/* eslint-disable react/prop-types */
import { useState } from 'react';
import Modal from '../../../ui/Modal';

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
        <Modal
            modalId="create_folder_modal"
            title="Add New Folder"
            description="Enter the name of the new folder."
            triggerButtonLabel="Add New Folder"
            triggerButtonClass="btn-outline btn-primary"
        >
            <form onSubmit={handleCreateFolder}>
                <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    required
                    className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
                />
                <button type="submit" disabled={creatingFolder} className="btn btn-primary">
                    {creatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
            </form>
        </Modal>
    );
};

export default CreateFolder;
