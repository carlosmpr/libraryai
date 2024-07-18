import { useEffect, useState } from 'react';
import Heading from '../components/Ui/Heading';
import BentoCard from '../components/Ui/BentoCard';
import Modal from '../components/Ui/Modal';// Adjust the import path according to your file structure

const MainLibrary = () => {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRepoName, setNewRepoName] = useState('');
    const [creatingRepo, setCreatingRepo] = useState(false);

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await fetch('/api/repositories/library', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Include cookies in the request
                });

                if (response.ok) {
                    const data = await response.json();
                    setRepositories(data.repositories);
                } else {
                    console.error('Failed to fetch repositories');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, []);

    const handleCreateRepository = async (e) => {
        e.preventDefault();
        setCreatingRepo(true);

        try {
            const response = await fetch('/api/create-repository', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify({ name: newRepoName })
            });

            if (response.ok) {
                const data = await response.json();
                setRepositories([...repositories, data.repository]); // Add new repository to state
                setNewRepoName('');
            } else {
                console.error('Failed to create repository');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setCreatingRepo(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10 bg-base-200/70">
            <Heading title={"Select your library"} decoration={"Libraries"} />

            <div className="flex gap-10 flex-wrap">
                <Modal
                    modalId="create_library_modal"
                    title="Create A New Library"
                    description="Enter the name of the new library."
                    triggerButtonLabel="Create New Library"
                    triggerButtonClass="flex flex-col btn-outline btn-primary"
                >
                    <form onSubmit={handleCreateRepository} className="space-y-4">
                        <input
                            type="text"
                            value={newRepoName}
                            onChange={(e) => setNewRepoName(e.target.value)}
                            placeholder="Library Name"
                            required
                            className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
                        />
                        <button
                            type="submit"
                            disabled={creatingRepo}
                            className="btn btn-primary"
                        >
                            {creatingRepo ? 'Creating...' : 'Create Library'}
                        </button>
                    </form>
                </Modal>
                {repositories.map((repo) => (
                    <BentoCard
                        key={repo.id}
                        title={repo.name}
                        description={
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default MainLibrary;
