const axios = require('axios');
const config = require('../config/config');

// Facebook login
exports.facebookLogin = (req, res) => {
    const url = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${config.facebookAppId}&redirect_uri=${config.redirectUri}&scope=email,public_profile,user_friends,user_likes,user_hometown,user_location,user_gender,user_about_me,user_birthday,user_photos,user_posts,user_videos,user_events,user_relationships,user_tagged_places`; // Added additional permissions
    res.json({ loginUrl: url });
};

// Facebook callback
exports.facebookCallback = async (req, res) => {
    const { code } = req.query; // Capture the authorization code from the query parameters

    // Check if the code exists
    if (!code) {
        return res.status(400).json({ error: 'No authorization code provided' });
    }

    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=${config.facebookAppId}&redirect_uri=${config.redirectUri}&client_secret=${config.facebookAppSecret}&code=${code}`;

    try {
        // Get the access token
        const response = await axios.get(tokenUrl);
        const accessToken = response.data.access_token; // Retrieve access token

        // Fetch user data
        const userUrl = `https://graph.facebook.com/me?fields=id,name,email,picture,friends,hometown,location,gender,about,birthday,photos,posts,videos,events,relationships,tagged_places&access_token=${accessToken}`;
        const userData = await axios.get(userUrl);

        // Calculate followers count
        const followersCount = userData.data.friends ? userData.data.friends.summary.total_count : 0;

        // Fetch likes and comments for each post
        const postsData = await fetchUserPosts(accessToken);

        // Send user data along with followers count and posts data
        res.json({
            ...userData.data,
            followers_count: followersCount,
            posts: postsData
        }); // Send user data as JSON response
    } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : 'An error occurred while fetching user data. Please try again later.' });
    }
};

// Function to fetch user's posts with likes and comments
const fetchUserPosts = async (accessToken) => {
    try {
        const postsUrl = `https://graph.facebook.com/me/posts?access_token=${accessToken}`;
        const postsResponse = await axios.get(postsUrl);
        const postsData = await Promise.all(postsResponse.data.data.map(async (post) => {
            // Fetch likes for the post
            const likesUrl = `https://graph.facebook.com/${post.id}/likes?access_token=${accessToken}`;
            const likesResponse = await axios.get(likesUrl);
            const likesCount = likesResponse.data.data.length;

            // Fetch comments for the post
            const commentsUrl = `https://graph.facebook.com/${post.id}/comments?access_token=${accessToken}`;
            const commentsResponse = await axios.get(commentsUrl);
            const commentsCount = commentsResponse.data.data.length;

            return {
                ...post,
                likes_count: likesCount,
                comments_count: commentsCount,
            };
        }));

        return postsData;
    } catch (error) {
        console.error('Error fetching user posts:', error.response ? error.response.data : error.message);
        return []; // Return an empty array on error
    }
};

// Function to handle data deletion request
exports.dataDeletionRequest = (req, res) => {
    const signedRequest = req.body.signed_request; // Get the signed request from the request body
    const data = parseSignedRequest(signedRequest);
    
    if (!data || !data.user_id) {
        return res.status(400).json({ error: 'Invalid signed request.' });
    }

    // Here you would include your logic to delete user data based on the userId
    const userId = data.user_id;

    // URL to check the status of the deletion request
    const statusUrl = 'https://www.yourwebsite.com/deletion-status?id=' + userId; // Replace with your status URL
    const confirmationCode = generateConfirmationCode(); // Generate a unique confirmation code

    const responseData = {
        url: statusUrl,
        confirmation_code: confirmationCode
    };

    res.json(responseData); // Send the response as JSON
};

// Function to parse the signed request
const parseSignedRequest = (signedRequest) => {
    const [encodedSig, payload] = signedRequest.split('.', 2);
    const sig = base64UrlDecode(encodedSig);
    
    // Decode the payload and validate the signature
    const data = JSON.parse(base64UrlDecode(payload));
    const expectedSig = crypto.createHmac('sha256', config.facebookAppSecret).update(payload).digest('base64');

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
