import express from 'express';
import { Octokit } from '@octokit/rest';
import { ensureAuthenticated } from '../middleware/authMiddleware.mjs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helper functions
const getOctokitInstance = (token) => new Octokit({ auth: token });

const getRepoName = (githubUsername) => `library-${githubUsername}-config`;

const fetchRepoContent = async (octokit, githubUsername, repoName, path) => {
    const { data } = await octokit.rest.repos.getContent({
        owner: githubUsername,
        repo: repoName,
        path: path,
    });
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { content: JSON.parse(content), sha: data.sha };
};

const checkOrCreateRepo = async (octokit, githubUsername, repoName) => {
    try {
        await octokit.rest.repos.get({ owner: githubUsername, repo: repoName });
    } catch (repoError) {
        if (repoError.status === 404) {
            await octokit.rest.repos.createForAuthenticatedUser({
                name: repoName,
                private: false,
            });
        } else {
            throw repoError;
        }
    }
};

const updateRepoContent = async (octokit, githubUsername, repoName, path, message, content, sha) => {
    await octokit.rest.repos.createOrUpdateFileContents({
        owner: githubUsername,
        repo: repoName,
        path: path,
        message: message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha: sha || undefined,
    });
};

// Routes
router.get('/get-instructions', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = getRepoName(githubUsername);
    const octokit = getOctokitInstance(token);

    try {
        const { content: instructions } = await fetchRepoContent(octokit, githubUsername, repoName, 'user-instructions.json');
        res.json({ instructions });
    } catch (error) {
        if (error.status === 404) {
            res.json({ instructions: [] });
        } else {
            console.error('Error fetching instructions:', error);
            res.status(500).json({ error: 'Failed to fetch instructions' });
        }
    }
});

router.post('/save-instructions', ensureAuthenticated, async (req, res) => {
    const { instructionName, model, instructions } = req.body;
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = getRepoName(githubUsername);
    const octokit = getOctokitInstance(token);

    try {
        await checkOrCreateRepo(octokit, githubUsername, repoName);

        let instructionsArray = [];
        let sha;

        try {
            const { content, sha: fileSha } = await fetchRepoContent(octokit, githubUsername, repoName, 'user-instructions.json');
            instructionsArray = content;
            sha = fileSha;
        } catch (fileError) {
            if (fileError.status !== 404) {
                throw fileError;
            }
        }

        const id = uuidv4();
        instructionsArray.push({ id, name: instructionName, model, instructions });
        await updateRepoContent(octokit, githubUsername, repoName, 'user-instructions.json', `Add new instruction: ${instructionName}`, instructionsArray, sha);

        res.json({ message: 'Instructions saved successfully!', instruction: { id, name: instructionName, model, instructions } });
    } catch (error) {
        console.error('Error saving instructions:', error);
        res.status(500).json({ error: 'Failed to save instructions' });
    }
});

router.post('/update-instruction', ensureAuthenticated, async (req, res) => {
    const { id, instructionName, model, instructions } = req.body;
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = getRepoName(githubUsername);
    const octokit = getOctokitInstance(token);

    try {
        await checkOrCreateRepo(octokit, githubUsername, repoName);

        let instructionsArray = [];
        let sha;

        try {
            const { content, sha: fileSha } = await fetchRepoContent(octokit, githubUsername, repoName, 'user-instructions.json');
            instructionsArray = content;
            sha = fileSha;
        } catch (fileError) {
            if (fileError.status !== 404) {
                throw fileError;
            }
        }

        const updatedInstructionsArray = instructionsArray.map(instruction =>
            instruction.id === id ? { id, name: instructionName, model, instructions } : instruction
        );
        await updateRepoContent(octokit, githubUsername, repoName, 'user-instructions.json', `Update instruction: ${instructionName}`, updatedInstructionsArray, sha);

        res.json({ message: 'Instruction updated successfully!', instruction: { id, name: instructionName, model, instructions } });
    } catch (error) {
        console.error('Error updating instruction:', error);
        res.status(500).json({ error: 'Failed to update instruction' });
    }
});

router.delete('/delete-instruction', ensureAuthenticated, async (req, res) => {
    const { id } = req.body;
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = getRepoName(githubUsername);
    const octokit = getOctokitInstance(token);

    try {
        let instructionsArray = [];
        let sha;

        try {
            const { content, sha: fileSha } = await fetchRepoContent(octokit, githubUsername, repoName, 'user-instructions.json');
            instructionsArray = content;
            sha = fileSha;
        } catch (fileError) {
            if (fileError.status === 404) {
                return res.status(404).json({ error: 'Instructions file not found' });
            } else {
                throw fileError;
            }
        }

        const updatedInstructions = instructionsArray.filter(instruction => instruction.id !== id);
        await updateRepoContent(octokit, githubUsername, repoName, 'user-instructions.json', `Delete instruction with id: ${id}`, updatedInstructions, sha);

        res.json({ message: 'Instruction deleted successfully!' });
    } catch (error) {
        console.error('Error deleting instruction:', error);
        res.status(500).json({ error: 'Failed to delete instruction' });
    }
});

export default router;
