import express from 'express';
import path from 'path';
import { ensureAuthenticated } from '../middleware/authMiddleware.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const distPath = path.join(__dirname, '../dist');

// Serve static files
router.use(express.static(distPath));

// Root route: Redirect to /mainlibrary if authenticated
router.get('/', (req, res) => {
    console.log('Root route accessed. User isAuthenticated:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.redirect('/library');
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Ensure authenticated for /mainlibrary
router.get('/library', ensureAuthenticated, (req, res) => {
    console.log('Serving mainlibrary page');
    res.sendFile(path.join(distPath, 'index.html'));
});

// Route to serve library details page
router.get('/library/:repoName', ensureAuthenticated, (req, res) => {
    console.log('Serving library page');
    res.sendFile(path.join(distPath, 'index.html'));
});

router.get('/customizeprompt', ensureAuthenticated, (req, res) => {
    console.log('Serving customize prompt page');
    res.sendFile(path.join(distPath, 'index.html'));
});

router.get('/userPrompts', ensureAuthenticated, (req, res) => {
    console.log('Serving user prompts page');
    res.sendFile(path.join(distPath, 'index.html'));
});

export default router;
