import express from 'express';
import { Octokit } from '@octokit/rest';
import { ensureAuthenticated } from '../../middleware/authMiddleware.mjs';
import multer from 'multer';
import { createFile } from '../../helpers/aiHelper.mjs';
import { createMarkdown, createOrUpdateFile, fileExists, initialReadme } from '../../helpers/helpers.mjs';
import { sanitizeCreateRepository } from '../../helpers/formValidations.mjs';
import { wss } from '../../index.mjs';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-repository', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;
    const octokit = new Octokit({ auth: token });

    try {
        let { name, description } = req.body;

        // Validate and sanitize inputs
        const { sanitizedTitle, sanitizedDescription } = sanitizeCreateRepository(name, description);

        const repoName = `library-${sanitizedTitle}`; // Add the 'library-' prefix

        // Create the repository with a description and auto-init (default README)
        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            description: sanitizedDescription,
            private: false, // Change to true if you want it to be private
            auto_init: true, // Create an initial commit with a README
        });

        // Fetch the README file to get its sha
        const readmeResponse = await octokit.rest.repos.getContent({
            owner: response.data.owner.login,
            repo: repoName,
            path: 'README.md',
        });

        const readmeSha = readmeResponse.data.sha;

        // Optionally, add content to the README file
        const currentYear = new Date().getFullYear();
        const fullName = req.user.profile.displayName || req.user.profile.username;

        const readmeContent = initialReadme(repoName,
            sanitizedDescription,
            currentYear,
            fullName)

        await octokit.rest.repos.createOrUpdateFileContents({
            owner: response.data.owner.login,
            repo: repoName,
            path: 'README.md',
            message: 'Update README with initial content',
            content: Buffer.from(readmeContent).toString('base64'),
            sha: readmeSha, // Include the sha of the existing README file
        });

        res.json({
            message: 'Repository created successfully!',
            repository: response.data,
            repositoryUrl: response.data.html_url
        });
        
    } catch (error) {
        console.error('Failed to create repository:', error);
        res.status(500).send('Failed to create repository');
    }
});




router.post('/create-folder', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;
    const { repository, structure } = req.body;
    const octokit = new Octokit({ auth: token });

    const owner = req.user.profile.username;
    const message = 'Create folder with .gitkeep';

    try {
        for (const folder of structure.structure) {
            const path = `${folder}/.gitkeep`;
            await createOrUpdateFile(octokit, owner, repository, path, message, '');
        }

        res.json({
            message: 'Selected folder structure created successfully!'
        });
    } catch (error) {
        console.error('Failed to create selected folder structure:', error);
        res.status(500).send('Failed to create selected folder structure');
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

        // Filter out the config repositories
        const filteredRepos = data.items.filter(repo => !repo.name.startsWith(`library-${username}-config`));

        res.json({
            message: 'Repositories fetched successfully!',
            repositories: filteredRepos
        });
    } catch (error) {
        console.error('Failed to fetch repositories:', error);
        res.status(500).send('Failed to fetch repositories');
    }
});


router.post('/upload-file', ensureAuthenticated, upload.array('files', 4), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const { repository, path: uploadPath, model, instructions } = req.body;
    const token = req.user.accessToken;
    const octokit = new Octokit({ auth: token });
    const userId = req.user.id;

    try {
        const results = [];
        let processedFiles = 0;

        for (const file of req.files) {
            const content = file.buffer.toString('utf8');
            const completion = await createFile(content, model, instructions);
            const explanation = completion.text;
            const markdownContent = createMarkdown(file.originalname, explanation, content);

            const cleanPath = uploadPath.startsWith('/') ? uploadPath.substring(1) : uploadPath;
            let baseFileName = file.originalname.replace(/\.(js|jsx|ts|tsx|py|java|rb|php|html|css|cpp|c|go|rs|swift|kt|m|h|cs|json|xml|sh|yml|yaml|vue|svelte|qwik|sv|astro)$/, '');
            let extension = '.md';
            let markdownFilePath = `${cleanPath}/${baseFileName}${extension}`;

            // Check if file exists and append version number if necessary
            let version = 1;
            while (await fileExists(octokit, req.user.profile.username, repository, markdownFilePath)) {
                markdownFilePath = `${cleanPath}/${baseFileName}_v${version}${extension}`;
                version++;
            }

            const response = await octokit.rest.repos.createOrUpdateFileContents({
                owner: req.user.profile.username,
                repo: repository,
                path: markdownFilePath,
                message: `Upload file ${file.originalname}`,
                content: Buffer.from(markdownContent).toString('base64')
            });

            results.push(response.data);

            // Increment the progress after processing each file and send progress update
            processedFiles++;
            const progress = (processedFiles / req.files.length) * 100;
            console.log(`Processed Files: ${processedFiles}, Progress: ${progress}%`); // Debug log
            wss.clients.forEach(client => {
                if (client.readyState === 1){
                    console.log(`Sending progress to client ${client.userId}: ${progress}%`);
                    client.send(JSON.stringify({ progress }));
                }
            });

            // Ensure the message is sent before processing the next file
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        res.json({
            message: 'Files uploaded successfully!',
            data: results
        });
    } catch (error) {
        console.error('Failed to upload files:', error);
        res.status(500).send('Failed to upload files');
    }
});




export default router;
