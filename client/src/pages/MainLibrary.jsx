import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div>
            <h1>Library Repositories</h1>
            <ul>
                {repositories.map(repo => (
                    <li key={repo.id}>
                        <Link to={`/library/${repo.name}`}>
                            {repo.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <h2>Create New Library Repository</h2>
            <form onSubmit={handleCreateRepository}>
                <input
                    type="text"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="Repository name"
                    required
                />
                <button type="submit" disabled={creatingRepo}>
                    {creatingRepo ? 'Creating...' : 'Create Repository'}
                </button>
            </form>
        </div>
    );
};

export default MainLibrary;
