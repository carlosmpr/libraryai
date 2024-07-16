import express from 'express';
import path from 'path';
import { ensureAuthenticated } from '../middleware/authMiddleware.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const distPath = path.join(__dirname, '../dist');


// Root route: Redirect to /mainlibrary if authenticated
router.get('/', (req, res) => {
    console.log('Root route accessed. User isAuthenticated:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.redirect('/mainlibrary');
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

// Ensure authenticated for /mainlibrary
router.get('/mainlibrary', ensureAuthenticated, (req, res) => {
    console.log('Serving mainlibrary page');
    res.sendFile(path.join(distPath, 'index.html'));
});


router.get('/gettoken', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Hello, ${req.user.profile.username}! Token: ${req.user.accessToken}`);
    } else {
        res.send('Please login via GitHub.');
    }
});


// Fallback route: Serve the index.html for any other paths
// router.get('*', (req, res) => {
//     console.log('Fallback route accessed. Serving index.html');
//     res.sendFile(path.join(distPath, 'index.html'));
// });

router.use(express.static(distPath));



export default router;
