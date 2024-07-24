import express from 'express';
import { Octokit } from '@octokit/rest';
import { ensureAuthenticated } from '../../middleware/authMiddleware.mjs';
import multer from 'multer';
import { createFile } from '../../helpers/aiHelper.mjs';
import { createMarkdown } from '../../helpers/helpers.mjs';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-repository', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;
    const octokit = new Octokit({ auth: token });

    try {
        let { name, description } = req.body; // Repository name and description passed from the client
        name = `library-${name}`; // Add the 'library-' prefix

        // Create the repository with a description and auto-init (default README)
        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name,
            description,
            private: false, // Change to true if you want it to be private
            auto_init: true, // Create an initial commit with a README
        });

        // Fetch the README file to get its sha
        const readmeResponse = await octokit.rest.repos.getContent({
            owner: response.data.owner.login,
            repo: name,
            path: 'README.md',
        });

        const readmeSha = readmeResponse.data.sha;

        // Optionally, add content to the README file
        const currentYear = new Date().getFullYear();
        const fullName = req.user.profile.displayName || req.user.profile.username;

        const readmeContent = `
        # ${name}
        
        ${description}
        
        ## About
        
        This repository is created with the Code-Library-App, an auto-documentation software powered by AI. It allows you to store your code in markdown files, creating documentation and storing them in GitHub. This tool is useful for creating UI, tutorials, guides, or simply storing and ensuring you don't lose your code or component code.
         
        
        MIT License
        
        Copyright (c) ${currentYear} ${fullName}
        
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
        `;
        
        
        

        await octokit.rest.repos.createOrUpdateFileContents({
            owner: response.data.owner.login,
            repo: name,
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

const createOrUpdateFile = async (octokit, owner, repo, path, message, content) => {
    try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
        // Update the existing file with the correct sha
        return octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message,
            content: Buffer.from(content).toString('base64'),
            sha: data.sha
        });
    } catch (error) {
        if (error.status === 404) {
            // Create the file if it does not exist
            return octokit.rest.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message,
                content: Buffer.from(content).toString('base64')
            });
        } else {
            throw error;
        }
    }
};

router.post('/create-folder', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;
    const { repository } = req.body;
    const octokit = new Octokit({ auth: token });

    const folders = ['introduction', 'ui', 'sections', 'pages', 'animations', 'helperFunctions'];
    const owner = req.user.profile.username;
    const message = 'Create folder with .gitkeep';

    try {
        for (const folder of folders) {
            const path = `${folder}/.gitkeep`;
            await createOrUpdateFile(octokit, owner, repository, path, message, '');
        }

        res.json({
            message: 'Default folder structure created successfully!'
        });
    } catch (error) {
        console.error('Failed to create default folder structure:', error);
        res.status(500).send('Failed to create default folder structure');
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

    try {
        const results = [];

        for (const file of req.files) {
            const content = file.buffer.toString('utf8');
            const completion = await createFile(content, model, instructions);
            const explanation = completion.text;
            const markdownContent = createMarkdown(file.originalname, explanation, content);

            const cleanPath = uploadPath.startsWith('/') ? uploadPath.substring(1) : uploadPath;
            const markdownFilePath = `${cleanPath}/${file.originalname.replace(/\.(jsx?|tsx?)$/, '.md')}`;

            const response = await octokit.rest.repos.createOrUpdateFileContents({
                owner: req.user.profile.username,
                repo: repository,
                path: markdownFilePath,
                message: `Upload file ${file.originalname}`,
                content: Buffer.from(markdownContent).toString('base64')
            });

            results.push(response.data);
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
