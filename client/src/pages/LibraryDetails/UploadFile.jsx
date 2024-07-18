/* eslint-disable react/prop-types */
import { useState } from 'react';
import Modal from '../../components/Ui/Modal';
import { ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const UploadFile = ({ repoName, loadContents, contents }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadPath, setUploadPath] = useState('');
    const [error, setError] = useState('');

    const allowedExtensions = ['.js', '.jsx', '.tsx'];

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const items = e.dataTransfer.items;
        const filesArray = [];

        for (const item of items) {
            const entry = item.webkitGetAsEntry();
            if (entry.isFile) {
                const file = await new Promise((resolve) => entry.file(resolve));
                if (isValidFile(file)) {
                    filesArray.push(file);
                } else {
                    setError('Invalid file type. Only .js, .jsx, and .tsx files are allowed.');
                }
            } else if (entry.isDirectory) {
                await traverseFileTree(entry, filesArray);
            }
        }

        if (filesArray.length + selectedFiles.length > 4) {
            setError('You can only upload a maximum of 4 files.');
        } else {
            setSelectedFiles([...selectedFiles, ...filesArray].slice(0, 4));
            setError('');
        }
    };

    const isValidFile = (file) => {
        return allowedExtensions.some((ext) => file.name.endsWith(ext));
    };

    const traverseFileTree = (item, filesArray) => {
        return new Promise((resolve) => {
            if (item.isFile) {
                item.file((file) => {
                    if (isValidFile(file)) {
                        filesArray.push(file);
                    }
                    resolve();
                });
            } else if (item.isDirectory) {
                const dirReader = item.createReader();
                dirReader.readEntries(async (entries) => {
                    for (const entry of entries) {
                        await traverseFileTree(entry, filesArray);
                    }
                    resolve();
                });
            }
        });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const filteredFiles = files.filter(isValidFile);
        if (filteredFiles.length + selectedFiles.length > 4) {
            setError('You can only upload a maximum of 4 files.');
        } else {
            setSelectedFiles([...selectedFiles, ...filteredFiles].slice(0, 4));
            setError('');
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0 || !uploadPath) return;

        setUploadingFile(true);

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append('files', file));
        formData.append('repository', repoName);
        formData.append('path', uploadPath);

        try {
            const response = await fetch('/api/upload-file', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                setSelectedFiles([]);
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

    const handleModalClose = () => {
        setSelectedFiles([]);
        setError('');
    };

    const handleClearFiles = () => {
        setSelectedFiles([]);
        setError('');
    };

    return (
        <Modal
            modalId="upload_file_modal"
            title="Upload New File"
            description="Select a file to upload to the repository."
            triggerButtonLabel="Upload new file"
            triggerButtonClass="btn-outline btn-secondary"
            onClose={handleModalClose}  // Ensure this line is here to handle modal close
        >
            <form onSubmit={handleFileUpload}>
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer mb-4 h-[200px] flex overflow-y-scroll items-center justify-center"
                >
                    <input
                        type="file"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        id="fileUpload"
                        multiple
                     
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                        {selectedFiles.length > 0 ? (
                            <div className='flex flex-wrap gap-10'>
                                {selectedFiles.map((file) => (
                                    <div key={file.name}>
                                        <DocumentTextIcon className="mx-auto w-8" />
                                        <p>{file.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <ArrowUpTrayIcon className="mx-auto w-8" />
                                <p>Drag & drop files or folders here, or click to select files</p>
                            </div>
                        )}
                    </label>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="button" onClick={handleClearFiles} className="btn btn-secondary mb-4">
                    Clear Selected Files
                </button>
                <div className="mb-4">
                    <h3>Select Directory:</h3>
                    {contents.filter(item => item.type === 'dir').map((item) => (
                        <div key={item.path} className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="uploadPath"
                                value={item.path}
                                onChange={(e) => setUploadPath(e.target.value)}
                                className="radio radio-primary mr-2"
                                required
                            />
                            <label>{item.name}</label>
                        </div>
                    ))}
                </div>
                <button type="submit" disabled={uploadingFile || !uploadPath} className="btn btn-primary">
                    {uploadingFile ? 'Uploading...' : 'Upload File'}
                </button>
            </form>
        </Modal>
    );
};

export default UploadFile;
