const express = require('express');
const cors = require('cors');

// Try-Catch block for importing routes to handle any missing module errors
let authroute, dataDeletionRoute;
try {
    authroute = require('./routes/authroutes'); // Ensure the correct file name and path
    dataDeletionRoute = require('./routes/datadeletion'); // Ensure the correct file name and path
    console.log('Routes imported successfully.');
} catch (error) {
    console.error('Error loading routes:', error.message);
    process.exit(1); // Exit the process if routes cannot be loaded
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
