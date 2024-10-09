const axios = require('axios');
const config = require('../config/config');

// Facebook login
exports.facebookLogin = (req, res) => {
    const url = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${config.facebookAppId}&redirect_uri=${config.redirectUri}&scope=email,public_profile,user_friends,user_likes,user_hometown,user_location,user_gender,user_about_me,user_birthday,user_photos,user_posts,user_videos,user_events,user_relationships,user_tagged_places`;
    res.json({ loginUrl: url });
};

// Instagram login
exports.instagramLogin = (req, res) => {
    const url = `https://api.instagram.com/oauth/authorize?client_id=${config.instagramAppId}&redirect_uri=${config.instagramRedirectUri}&scope=user_profile,user_media&response_type=code`;
    res.json({ loginUrl: url });
};

// Facebook callback
exports.facebookCallback = async (req, res) => {
    // Your existing Facebook callback logic...
};

// Instagram callback
exports.instagramCallback = async (req, res) => {
    const { code } = req.query; // Capture the authorization code from the query parameters

    // Check if the code exists
    if (!code) {
        return res.status(400).json({ error: 'No authorization code provided' });
    }

    // Exchange code for access token
    const tokenUrl = `https://api.instagram.com/oauth/access_token`;
    const params = {
        client_id: config.instagramAppId,
        client_secret: config.instagramAppSecret,
        grant_type: 'authorization_code',
        redirect_uri: config.instagramRedirectUri,
        code: code,
    };

    try {
        const response = await axios.post(tokenUrl, null, { params });
        const accessToken = response.data.access_token;

        // Fetch user data from Instagram
        const userUrl = `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`;
        const userData = await axios.get(userUrl);

        // Fetch media data (posts, likes, comments, etc.)
        const mediaUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp,children{media_type,media_url}&access_token=${accessToken}`;
        const mediaData = await axios.get(mediaUrl);

        res.json({
            user: userData.data,
            media: mediaData.data,
        });
    } catch (error) {
        console.error('Error fetching Instagram data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : 'An error occurred while fetching Instagram data. Please try again later.' });
    }
};
