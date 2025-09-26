const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add proper MIME types for .js files
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).send('Something went wrong with the Antikythera Astrolabe!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`🌟 Antikythera Astrolabe server running at http://localhost:${PORT}`);
    console.log(`✨ Your ancient astronomical instrument awaits!`);
    console.log(`🔮 Navigate to the URL above to explore your natal chart`);
});

module.exports = app;