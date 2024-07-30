import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import session from 'express-session';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import githubRoutes from './routes/github/githubRoutes.mjs';
import clientRoutes from './routes/clientRoutes.mjs';
import aiRoutes from './routes/aiRoutes.mjs';

config();
const app = express();
const port = process.env.PORT || 8080;

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://libraryai-efbafc7d6218.herokuapp.com/auth/github/callback"
}, (accessToken, refreshToken, profile, cb) => {
    profile.accessToken = accessToken; // Attach accessToken
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

app.get('/auth/github', passport.authenticate('github', { scope: ['public_repo'] }));

app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/library');
    });

app.get('/signout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/'); // Redirect to home page after logging out
    });
});

app.get('/api/user/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ profile: req.user.profile });
    } else {
        res.status(401).send('Not authenticated');
    }
});

// Use the client routes
app.use('/', clientRoutes);
app.use('/api', githubRoutes);
app.use('/ai', aiRoutes);

// Setup WebSocket server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    const userId = req.headers['sec-websocket-protocol']; // Assuming user ID is passed as a subprotocol
    ws.userId = userId;
    console.log('WebSocket connection established for user:', userId);
});

export { wss };
///