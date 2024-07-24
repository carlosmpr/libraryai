import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {ensureAuthenticated} from '../middleware/authMiddleware.mjs'

const router = express.Router();

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render the HTML file from the dist directory
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Ensure authenticated for /library
router.get('/library', ensureAuthenticated,(req, res) => {
  console.log('Serving library page');
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Route to serve library details page
router.get('/library/:repoName', ensureAuthenticated, (req, res) => {
  console.log('Serving library details page');
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

router.get('/customizeprompt', ensureAuthenticated,(req, res) => {
  console.log('Serving customize prompt page');
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

router.get('/userPrompts',ensureAuthenticated, (req, res) => {
  console.log('Serving user prompts page');
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

export default router;
