const express = require('express');
const cors = require('cors');

try {
    const authroute = require('./routes/authroutes'); // Make sure the file name and path are correct
    const dataDeletionRoute = require('./routes/datadeletion'); // Import the data deletion route
    console.log('Routes imported successfully.');
} catch (error) {
    console.error('Error loading routes:', error.message);
    process.exit(1); // Exit the process if there is an issue with loading the routes
}

const app = express();
app.use(cors());
app.use(express.json());

// Setup routes
app.use('/auth', authroute); // Authentication routes
app.use('/delete', dataDeletionRoute); // Data deletion route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
