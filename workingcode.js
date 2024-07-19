import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import session from 'express-session';
import { Octokit } from '@octokit/rest';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureAuthenticated } from './middleware/authMiddleware.mjs'

config(); // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, cb) => {
    profile.accessToken = accessToken; // Attach accessToken
    // Depending on the library version and returned data
    const user = {
        profile: profile,
        accessToken: accessToken
    };
    return cb(null, user); // Pass the whole structured user object
}));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get('/auth/github', passport.authenticate('github', { scope: ['repo'] }));


app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    });

// app.get('/', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.send(`Hello, ${req.user.profile.username}! Token: ${req.user.accessToken}`);
//     } else {
//         res.send('Please login via GitHub.');
//     }
// });

app.post('/create-repository', async (req, res) => {
    // Check for GitHub token in the Authorization header
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


const authenticateWithBearerToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        req.token = token;
        return next();
    }
    res.status(401).send('Unauthorized: Bearer token missing or invalid');
};

app.post('/create-folder', async (req, res) => {
    // if (!req.isAuthenticated() || !req.user.accessToken) {
    //     return res.status(401).send('You must be authenticated with GitHub to perform this action.');
    // }

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


app.get('/repository-contents', authenticateWithBearerToken, async (req, res) => {
    const token = req.token;
    const repo = req.query.repo;

    if (!repo) {
        return res.status(400).send('Repository name is required.');
    }

    const octokit = new Octokit({ auth: token });

    try {
        // Get the authenticated user's information
        const { data: { login: owner } } = await octokit.rest.users.getAuthenticated();

        const getContents = async (path = '') => {
            const response = await octokit.rest.repos.getContent({
                owner: owner,
                repo: repo,
                path: path,
                ref: 'main'
            });

            if (Array.isArray(response.data)) {
                // It's a directory
                return Promise.all(response.data.map(async (file) => {
                    if (file.type === 'dir') {
                        return {
                            name: file.name,
                            path: file.path,
                            type: file.type,
                            contents: await getContents(file.path) // Recursively fetch contents
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
                // It's a file
                return {
                    name: response.data.name,
                    path: response.data.path,
                    type: response.data.type,
                    download_url: response.data.download_url,
                    content: Buffer.from(response.data.content, 'base64').toString('utf-8') // Decode file content
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

app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user.profile });
    } else {
        res.json({ isAuthenticated: false });
    }
});



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/mainlibrary', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.get('*', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/mainlibrary');
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



// app.post('/create-repository', async (req, res) => {
//     if (!req.isAuthenticated() || !req.user.accessToken) {
//         return res.status(401).send('You must be authenticated with GitHub to perform this action.');
//     }

//     const octokit = new Octokit({ auth: req.user.accessToken });

//     try {
//         const { name } = req.body;
//         const response = await octokit.repos.createForAuthenticatedUser({
//             name,
//             private: true
//         });
//         res.json({
//             message: 'Repository created successfully!',
//             repositoryUrl: response.data.html_url
//         });
//     } catch (error) {
//         console.error('Failed to create repository:', error);
//         res.status(500).send('Failed to create repository');
//     }
// });