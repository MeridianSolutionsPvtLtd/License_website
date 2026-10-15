import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database Connection
const MONGO_URI = process.env.mongo_uri || process.env.MONGO_URI;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error('MongoDB Connection Error:', err));
} else {
    console.warn('Warning: Neither mongo_uri nor MONGO_URI environment variable is defined.');
}

// Routes
app.use('/api', apiRoutes);

// Serve static assets from dist
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head><title>SaaSMap Portal</title></head>
                <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                    <h2>Backend Server is running!</h2>
                    <p>However, the frontend build was not found in <code>dist/</code>.</p>
                    <p>Please ensure <code>npm run build</code> runs during deployment.</p>
                </body>
                </html>
            `);
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
