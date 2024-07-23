import express from 'express';
import { Octokit } from '@octokit/rest';
import { ensureAuthenticated } from '../../middleware/authMiddleware.mjs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();


router.get('/get-instructions', ensureAuthenticated, async (req, res) => {
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = `library-${githubUsername}-config`;
    const octokit = new Octokit({ auth: token });

    try {
        // Fetch the user-instructions.json file from the config repository
        const { data } = await octokit.rest.repos.getContent({
            owner: githubUsername,
            repo: repoName,
            path: 'user-instructions.json',
        });

        // Decode the file content
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const instructions = JSON.parse(content);

        res.json({ instructions });
    } catch (error) {
        if (error.status === 404) {
            // If the file or repo does not exist, return an empty array
            res.json({ instructions: [] });
        } else {
            console.error('Error fetching instructions:', error);
            res.status(500).json({ error: 'Failed to fetch instructions' });
        }
    }
});

// New route to save user instructions
router.post('/save-instructions', ensureAuthenticated, async (req, res) => {
    const { instructionName, model, instructions } = req.body;
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = `library-${githubUsername}-config`;
    const octokit = new Octokit({ auth: token });

    try {
        // Step 1: Check if the repository exists
        try {
            await octokit.rest.repos.get({
                owner: githubUsername,
                repo: repoName,
            });
        } catch (repoError) {
            // Step 2: Create the repository if it does not exist
            if (repoError.status === 404) {
                await octokit.rest.repos.createForAuthenticatedUser({
                    name: repoName,
                    private: true,
                });
            } else {
                throw repoError;
            }
        }

        let instructionsArray = [];
        let sha;

        try {
            // Step 3: Fetch the current user-instructions.json file if it exists
            const { data } = await octokit.rest.repos.getContent({
                owner: githubUsername,
                repo: repoName,
                path: 'user-instructions.json',
            });

            // Decode the file content
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            instructionsArray = JSON.parse(content);
            sha = data.sha; // The blob SHA of the file being replaced
        } catch (fileError) {
            if (fileError.status !== 404) {
                throw fileError;
            }
        }
        const id = uuidv4();
        // Step 4: Add the new instruction
        instructionsArray.push({  id: id,name: instructionName, model, instructions });

        // Encode the updated content
        const updatedContent = Buffer.from(JSON.stringify(instructionsArray, null, 2)).toString('base64');

        // Step 5: Create or update the file in the repository
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: githubUsername,
            repo: repoName,
            path: 'user-instructions.json',
            message: `Add new instruction: ${instructionName}`,
            content: updatedContent,
            sha: sha || undefined, // The blob SHA of the file being replaced, if it exists
        });

        res.json({ message: 'Instructions saved successfully!', instruction:{  id: id,name: instructionName, model, instructions } });

    } catch (error) {
        console.error('Error saving instructions:', error);
        res.status(500).json({ error: 'Failed to save instructions' });
    }
});

router.post('/update-instruction', ensureAuthenticated, async (req, res) => {
    const { id, instructionName, model, instructions } = req.body;
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = `library-${githubUsername}-config`;
    const octokit = new Octokit({ auth: token });

    try {
        // Check if the repository exists
        try {
            await octokit.rest.repos.get({
                owner: githubUsername,
                repo: repoName,
            });
        } catch (repoError) {
            if (repoError.status === 404) {
                await octokit.rest.repos.createForAuthenticatedUser({
                    name: repoName,
                    private: true,
                });
            } else {
                throw repoError;
            }
        }

        let instructionsArray = [];
        let sha;

        try {
            // Fetch the current user-instructions.json file if it exists
            const { data } = await octokit.rest.repos.getContent({
                owner: githubUsername,
                repo: repoName,
                path: 'user-instructions.json',
            });

            // Decode the file content
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            instructionsArray = JSON.parse(content);
            sha = data.sha;
        } catch (fileError) {
            if (fileError.status !== 404) {
                throw fileError;
            }
        }

        // Update the instruction
        const updatedInstructionsArray = instructionsArray.map(instruction => 
            instruction.id === id 
            ? { id, name: instructionName, model, instructions } 
            : instruction
        );

        // Encode the updated content
        const updatedContent = Buffer.from(JSON.stringify(updatedInstructionsArray, null, 2)).toString('base64');

        // Create or update the file in the repository
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: githubUsername,
            repo: repoName,
            path: 'user-instructions.json',
            message: `Update instruction: ${instructionName}`,
            content: updatedContent,
            sha: sha || undefined,
        });

        res.json({ message: 'Instruction updated successfully!', instruction: { id, name: instructionName, model, instructions } });
    } catch (error) {
        console.error('Error updating instruction:', error);
        res.status(500).json({ error: 'Failed to update instruction' });
    }
});


router.delete('/delete-instruction', ensureAuthenticated, async (req, res) => {
 
    const { id } = req.body;  // ID of the instruction to be deleted
    const token = req.user.accessToken;
    const githubUsername = req.user.profile.username;
    const repoName = `library-${githubUsername}-config`;
    const octokit = new Octokit({ auth: token });
    console.log(id)

    try {
        let instructionsArray = [];
        let sha;

        try {
            // Fetch the current user-instructions.json file if it exists
            const { data } = await octokit.rest.repos.getContent({
                owner: githubUsername,
                repo: repoName,
                path: 'user-instructions.json',
            });

            // Decode the file content
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            instructionsArray = JSON.parse(content);
            sha = data.sha; // The blob SHA of the file being replaced
        } catch (fileError) {
            if (fileError.status === 404) {
                console.log(fileError)
                return res.status(404).json({ error: 'Instructions file not found' });
            } else {
                throw fileError;
            }
        }

        // Remove the instruction with the specified id
        const updatedInstructions = instructionsArray.filter(instruction => instruction.id !== id);

        // Encode the updated content
        const updatedContent = Buffer.from(JSON.stringify(updatedInstructions, null, 2)).toString('base64');

        // Create or update the file in the repository
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: githubUsername,
            repo: repoName,
            path: 'user-instructions.json',
            message: `Delete instruction with id: ${id}`,
            content: updatedContent,
            sha: sha || undefined, // The blob SHA of the file being replaced, if it exists
        });

        res.json({ message: 'Instruction deleted successfully!' });

    } catch (error) {
        console.error('Error deleting instruction:', error);
        res.status(500).json({ error: 'Failed to delete instruction' });
    }
});


export default router;
