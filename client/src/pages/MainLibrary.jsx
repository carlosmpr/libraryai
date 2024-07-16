import  { useEffect, useState } from 'react';

const MainLibrary = () => {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Library Repositories</h1>
            <ul>
                {repositories.map(repo => (
                    <li key={repo.id}>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            {repo.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MainLibrary;
