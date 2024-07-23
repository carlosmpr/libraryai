import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import session from 'express-session';
import { config } from 'dotenv';
import githubRoutes from './routes/github/githubRoutes.mjs';
import clientRoutes from './routes/clientRoutes.mjs';
import aiRoutes from './routes/aiRoutes.mjs'

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

app.use('/api', githubRoutes);
app.use('/ai', aiRoutes);
app.use( '/', clientRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
