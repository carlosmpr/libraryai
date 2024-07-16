import express from 'express';
import { Octokit } from '@octokit/rest';
import { ensureAuthenticated } from '../middleware/authMiddleware.mjs'

const router = express.Router();

router.post('/create-repository', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assumes "Bearer TOKEN"
    if (!token) {
        return res.status(401).send('You must be authenticated with GitHub to perform this action.');
    }

    const octokit = new Octokit({
        auth: token
    });

    try {
        const { name } = req.body; // Repository name passed from the client
        const response = await octokit.repos.createForAuthenticatedUser({
            name,
            private: true // Change to false if you want it to be public
        });
        res.json({
            message: 'Repository created successfully!',
            repositoryUrl: response.data.html_url
        });
    } catch (error) {
        console.error('Failed to create repository:', error);
        res.status(500).send('Failed to create repository');
    }
});

router.post('/create-folder', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assumes "Bearer TOKEN"
    if (!token) {
        return res.status(401).send('You must be authenticated with GitHub to perform this action.');
    }

    const { folderName, repository, owner } = req.body;
    const octokit = new Octokit({
        auth: token
    });

    try {
        const path = `${folderName}/README.md`; // The path at which the README.md will be created
        const content = Buffer.from(`# ${folderName}\nThis is the README for the ${folderName}`).toString('base64'); // Content of the README.md file

        const response = await octokit.rest.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repository,
            path: path,
            message: `Create ${folderName} and add README`,
            content: content
        });

        res.json({
            message: 'Folder and README created successfully!',
            data: response.data
        });
    } catch (error) {
        console.error('Failed to create folder:', error);
        res.status(500).send('Failed to create folder');
    }
});

router.get('/repository-contents', ensureAuthenticated, async (req, res) => {
    const token = req.token;
    const repo = req.query.repo;

    if (!repo) {
        return res.status(400).send('Repository name is required.');
    }

    const octokit = new Octokit({ auth: token });

    try {
        const { data: { login: owner } } = await octokit.rest.users.getAuthenticated();

        const getContents = async (path = '') => {
            const response = await octokit.rest.repos.getContent({
                owner: owner,
                repo: repo,
                path: path,
                ref: 'main'
            });

            if (Array.isArray(response.data)) {
                return Promise.all(response.data.map(async (file) => {
                    if (file.type === 'dir') {
                        return {
                            name: file.name,
                            path: file.path,
                            type: file.type,
                            contents: await getContents(file.path) 
                        };
                    } else {
                        return {
                            name: file.name,
                            path: file.path,
                            type: file.type,
                            download_url: file.download_url
                        };
                    }
                }));
            } else {
                return {
                    name: response.data.name,
                    path: response.data.path,
                    type: response.data.type,
                    download_url: response.data.download_url,
                    content: Buffer.from(response.data.content, 'base64').toString('utf-8')
                };
            }
        };

        const contents = await getContents();

        res.json({
            message: 'Repository contents fetched successfully!',
            contents: contents
        });
    } catch (error) {
        console.error('Failed to fetch repository contents:', error);
        res.status(500).send('Failed to fetch repository contents');
    }
});

router.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user.profile });
    } else {
        res.json({ isAuthenticated: false });
    }
});

export default router;
