import express from 'express';
import { Octokit } from '@octokit/rest';
import { ensureAuthenticated } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/create-repository', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;

    const octokit = new Octokit({ auth: token });

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

router.post('/create-folder', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;

    const { folderName, repository } = req.body;
    const octokit = new Octokit({ auth: token });

    try {
        const path = `${folderName}/README.md`; // The path at which the README.md will be created
        const content = Buffer.from(`# ${folderName}\nThis is the README for the ${folderName}`).toString('base64'); // Content of the README.md file

        const response = await octokit.rest.repos.createOrUpdateFileContents({
            owner: req.user.profile.username,
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
    const token = req.user.accessToken;
    const { repo, path = '' } = req.query;

    if (!repo) {
        return res.status(400).send('Repository name is required.');
    }

    const octokit = new Octokit({ auth: token });

    try {
        const response = await octokit.rest.repos.getContent({
            owner: req.user.profile.username,
            repo: repo,
            path: path,
            ref: 'main'
        });

        const contents = Array.isArray(response.data) ? response.data : [response.data];

        res.json({
            message: 'Repository contents fetched successfully!',
            contents: contents.map(item => ({
                name: item.name,
                path: item.path,
                type: item.type,
                download_url: item.download_url || null,
                content: item.content ? Buffer.from(item.content, 'base64').toString('utf-8') : null
            }))
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

// New route to search for repositories starting with "library"
router.get('/repositories/library', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;
    const username = req.user.profile.username;
    const octokit = new Octokit({ auth: token });

    try {
        const { data } = await octokit.rest.search.repos({
            q: `user:${username} library in:name`,
            sort: 'stars',
            order: 'desc'
        });

        res.json({
            message: 'Repositories fetched successfully!',
            repositories: data.items
        });
    } catch (error) {
        console.error('Failed to fetch repositories:', error);
        res.status(500).send('Failed to fetch repositories');
    }
});



router.get('/repositories', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;

    const octokit = new Octokit({ auth: token });

    try {
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();

        res.json({
            message: 'Repositories fetched successfully!',
            repositories: repos
        });
    } catch (error) {
        console.error('Failed to fetch repositories:', error);
        res.status(500).send('Failed to fetch repositories');
    }
});

export default router;
