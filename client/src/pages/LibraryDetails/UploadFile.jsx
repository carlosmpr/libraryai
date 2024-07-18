/* eslint-disable react/prop-types */
import { useState } from 'react';

const UploadFile = ({ repoName, loadContents }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadPath, setUploadPath] = useState('');

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
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                setSelectedFile(null);
                setUploadPath('');
                loadContents();
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setUploadingFile(false);
        }
    };

    return (
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
    );
};

export default UploadFile;
