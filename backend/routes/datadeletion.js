const express = require('express');
const crypto = require('crypto'); // Import crypto for signature validation
const router = express.Router(); // Initialize the router

// Replace with your actual app secret from your Meta developer settings
const APP_SECRET = process.env.FACEBOOK_APP_SECRET; // Use environment variable for security

// Data deletion request callback
router.post('/data', (req, res) => {
    const signedRequest = req.body.signed_request; // Get the signed request from the request body
    const data = parseSignedRequest(signedRequest); // Parse the signed request
    
    if (!data || !data.user_id) {
        return res.status(400).json({ error: 'Invalid signed request.' });
    }

    // Logic to delete user data based on userId (Implement your deletion logic here)

    // URL to check the status of the deletion request
    const statusUrl = `http://facebook-check.onrender.com/deletion-status?id=${data.user_id}`; // Replace with your actual status URL
    const confirmationCode = generateConfirmationCode(); // Generate a unique confirmation code

    const responseData = {
        url: statusUrl,
        confirmation_code: confirmationCode
    };

    res.json(responseData); // Send the response as JSON
});

// Function to parse the signed request
const parseSignedRequest = (signedRequest) => {
    const [encodedSig, payload] = signedRequest.split('.', 2);
    const sig = base64UrlDecode(encodedSig);
    
    // Decode the payload and validate the signature
    const data = JSON.parse(base64UrlDecode(payload));
    const expectedSig = crypto.createHmac('sha256', APP_SECRET).update(payload).digest('base64');

    if (sig !== expectedSig) {
        console.error('Bad Signed JSON signature!');
        return null;
    }

    return data;
};

// Function to decode base64 URL
const base64UrlDecode = (input) => {
    return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
};

// Function to generate a confirmation code (this can be customized)
const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 15); // Simple random code generation
};

// Export the router
module.exports = router;
